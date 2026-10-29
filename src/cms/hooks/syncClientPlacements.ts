import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

function extractId(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object") {
    if ("id" in value && (value as { id: unknown }).id != null) {
      return extractId((value as { id: unknown }).id);
    }
    if ("image" in value && (value as { image: unknown }).image != null) {
      return extractId((value as { image: unknown }).image);
    }
  }
  return null;
}

function parseOrder(value: unknown, defaultVal = 0): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.trim().replace(/[^0-9-]/g, "");
    const parsed = parseInt(cleaned, 10);
    return Number.isFinite(parsed) ? parsed : defaultVal;
  }
  return defaultVal;
}

/**
 * Triggered after a Client document changes.
 * Syncs the configured placements to their respective collections & globals.
 */
export const syncClientPlacementsAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;

  const clientId = doc.id;
  if (clientId == null) return doc;

  const placements = doc.placements || {};
  const clientName = String(doc.name || "");
  const clientSlug = String(doc.slug || "");
  const clientPath = clientSlug ? `/clients/${clientSlug}` : "";

  // If this is an update and none of the fields affecting placements changed, skip completely.
  if (previousDoc) {
    const prevPlacements = previousDoc.placements || {};
    const prevName = String(previousDoc.name || "");
    const prevSlug = String(previousDoc.slug || "");
    const prevHeroImageId = extractId(previousDoc.hero?.image);
    const prevHeroHeading = String(previousDoc.hero?.heading || "").trim();
    const prevFeaturedStudy = extractId(previousDoc.featuredStudy);

    const currHeroImageId = extractId(doc.hero?.image);
    const currHeroHeading = String(doc.hero?.heading || "").trim();
    const currFeaturedStudy = extractId(doc.featuredStudy);

    const placementsEqual = JSON.stringify(placements) === JSON.stringify(prevPlacements);
    const identifiersEqual =
      clientName === prevName &&
      clientSlug === prevSlug &&
      currHeroImageId === prevHeroImageId &&
      currHeroHeading === prevHeroHeading &&
      currFeaturedStudy === prevFeaturedStudy;

    if (placementsEqual && identifiersEqual) {
      return doc;
    }
  }

  // Resolve hero image fallback from Client Hub or associated Case Study
  let defaultHeroImageId = extractId(doc.hero?.image);
  let defaultHeroHeading = String(doc.hero?.heading || "").trim();

  if (!defaultHeroImageId) {
    let studyDoc: Record<string, unknown> | null = null;
    const studyId = extractId(doc.featuredStudy);
    if (studyId) {
      try {
        studyDoc = (await req.payload.findByID({
          collection: "case-studies",
          id: studyId,
          depth: 0,
          req,
        })) as unknown as Record<string, unknown>;
      } catch {}
    }
    if (!studyDoc && clientId) {
      try {
        const found = await req.payload.find({
          collection: "case-studies",
          where: { client: { equals: clientId } },
          limit: 1,
          depth: 0,
          req,
        });
        studyDoc = (found.docs[0] as unknown as Record<string, unknown>) || null;
      } catch {}
    }
    if (studyDoc) {
      const studyHero = studyDoc.hero as {
        layout?: string;
        left?: unknown;
        right?: unknown;
        image?: unknown;
        heading?: string;
      } | undefined;
      const cLeft = extractId(studyHero?.left);
      const cRight = extractId(studyHero?.right);
      const cImg = extractId(studyHero?.image);
      defaultHeroImageId =
        studyHero?.layout === "split"
          ? cLeft || cRight || cImg
          : cImg || cLeft || cRight;
      if (!defaultHeroHeading) {
        defaultHeroHeading = String(studyHero?.heading || studyDoc.title || "").trim();
      }
    }
  }

  // Execute sync operations sequentially inside the same transaction
  // 1. Featured Projects Sync
  try {
    const fpConfig = placements.featuredProject;
    const existingFP = await req.payload.find({
      collection: "featured-projects",
      where: { client: { equals: clientId } },
      limit: 1,
      depth: 0,
      req,
    });
    const fpDoc = existingFP.docs[0];

    if (fpConfig?.enabled) {
      let imgId = extractId(fpConfig.image) || defaultHeroImageId;
      if (!imgId) {
        try {
          const anyMedia = await req.payload.find({
            collection: "media",
            limit: 1,
            depth: 0,
            req,
          });
          if (anyMedia.docs[0]) imgId = anyMedia.docs[0].id;
        } catch {}
      }

      const data: Record<string, unknown> = {
        name: clientName,
        description: fpConfig.description || defaultHeroHeading || `${clientName} project`,
        metric: fpConfig.metric?.trim() || "—",
        metricLabel: fpConfig.metricLabel?.trim() || "Featured Project",
        alt: fpConfig.alt || `${clientName} preview`,
        order: parseOrder(fpConfig.order, 0),
        client: clientId,
      };
      if (imgId != null) {
        data.image = imgId;
      }

      if (fpDoc) {
        await req.payload.update({
          collection: "featured-projects",
          id: fpDoc.id,
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      } else {
        await req.payload.create({
          collection: "featured-projects",
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else if (fpDoc) {
      await req.payload.delete({
        collection: "featured-projects",
        id: fpDoc.id,
        context: { skipSync: true, skipRevalidation: true },
        req,
      });
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Featured Project for client ${clientId}`,
    });
  }

  // 2. Portfolio Items Sync
  try {
    const piConfig = placements.portfolioItem;
    const existingPI = await req.payload.find({
      collection: "portfolio-items",
      where: { client: { equals: clientId } },
      limit: 1,
      depth: 0,
      req,
    });
    const piDoc = existingPI.docs[0];

    if (piConfig?.enabled) {
      let imgId = extractId(piConfig.image) || defaultHeroImageId;
      if (!imgId) {
        try {
          const anyMedia = await req.payload.find({
            collection: "media",
            limit: 1,
            depth: 0,
            req,
          });
          if (anyMedia.docs[0]) imgId = anyMedia.docs[0].id;
        } catch {}
      }

      const data: Record<string, unknown> = {
        name: clientName,
        category: piConfig.category || "Brand & Web",
        alt: piConfig.alt || `${clientName} portfolio visual`,
        order: parseOrder(piConfig.order, 0),
        client: clientId,
      };
      if (imgId != null) {
        data.image = imgId;
      }

      if (piDoc) {
        await req.payload.update({
          collection: "portfolio-items",
          id: piDoc.id,
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      } else {
        await req.payload.create({
          collection: "portfolio-items",
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else if (piDoc) {
      await req.payload.delete({
        collection: "portfolio-items",
        id: piDoc.id,
        context: { skipSync: true, skipRevalidation: true },
        req,
      });
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Portfolio Item for client ${clientId}`,
    });
  }

  // 3. Pain Points Sync
  try {
    const ppConfig = placements.painPoint;
    const existingPP = await req.payload.find({
      collection: "pain-points",
      where: { client: { equals: clientId } },
      limit: 1,
      depth: 0,
      req,
    });
    const ppDoc = existingPP.docs[0];

    if (ppConfig?.enabled) {
      const data = {
        tag: ppConfig.tag || clientName,
        quote: ppConfig.quote || defaultHeroHeading || `${clientName} challenge`,
        resolution: ppConfig.resolution || "Complete brand & digital system built by Design Asylum.",
        order: parseOrder(ppConfig.order, 0),
        client: clientId,
      };

      if (ppDoc) {
        await req.payload.update({
          collection: "pain-points",
          id: ppDoc.id,
          data,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      } else {
        await req.payload.create({
          collection: "pain-points",
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else if (ppDoc) {
      await req.payload.delete({
        collection: "pain-points",
        id: ppDoc.id,
        context: { skipSync: true, skipRevalidation: true },
        req,
      });
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Pain Point for client ${clientId}`,
    });
  }

  // 4. Homepage Case Studies Sync (Diverse)
  try {
    const hcsConfig = placements.homepageCaseStudy;
    const targetStudyId =
      extractId(hcsConfig?.caseStudy) || extractId(doc.featuredStudy);

    const existingHCS = await req.payload.find({
      collection: "homepage-case-studies",
      where: {
        or: [
          { client: { equals: clientId } },
          ...(targetStudyId ? [{ caseStudy: { equals: targetStudyId } }] : []),
        ],
      },
      limit: 1,
      depth: 0,
      req,
    });
    const hcsDoc = existingHCS.docs[0];

    if (hcsConfig?.enabled) {
      const data: Record<string, unknown> = {
        number: hcsConfig.number || "01",
        name: clientName,
        description: hcsConfig.description || defaultHeroHeading || "",
        tags: Array.isArray(hcsConfig.tags) ? hcsConfig.tags : [],
        order: parseOrder(hcsConfig.order, 0),
        client: clientId,
      };
      if (targetStudyId) {
        data.caseStudy = targetStudyId;
      }

      if (hcsDoc) {
        await req.payload.update({
          collection: "homepage-case-studies",
          id: hcsDoc.id,
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      } else {
        await req.payload.create({
          collection: "homepage-case-studies",
          data: data as never,
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else if (hcsDoc) {
      await req.payload.delete({
        collection: "homepage-case-studies",
        id: hcsDoc.id,
        context: { skipSync: true, skipRevalidation: true },
        req,
      });
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Homepage Case Study for client ${clientId}`,
    });
  }

  // 5. Clients Page Global Sync (/clients)
  try {
    const cpConfig = placements.clientsPage;
    const globalClients = (await req.payload.findGlobal({
      slug: "clients-index",
      depth: 0,
      req,
    })) as { cards?: Array<Record<string, unknown>> };

    let currentCards = Array.isArray(globalClients?.cards)
      ? [...globalClients.cards]
      : [];

    const isMatch = (card: Record<string, unknown>) => {
      const cardHref = String(card.href || "");
      const cardName = String(card.name || "").toLowerCase();
      return (
        (clientPath && cardHref === clientPath) ||
        cardName === clientName.toLowerCase()
      );
    };

    if (cpConfig?.enabled) {
      const cardImageId = extractId(cpConfig.image) || defaultHeroImageId;
      const cardOrder = parseOrder(cpConfig.order, 0);
      const cardData = {
        name: clientName,
        service: cpConfig.service || defaultHeroHeading || "",
        image: cardImageId || null,
        href: clientPath || "#",
        order: cardOrder,
      };

      const matchIndex = currentCards.findIndex(isMatch);
      if (matchIndex >= 0) {
        currentCards[matchIndex] = {
          ...currentCards[matchIndex],
          ...cardData,
        };
      } else {
        currentCards.push(cardData);
      }

      currentCards = currentCards.map((card, idx) => ({
        ...card,
        order:
          typeof card.order === "number" && card.order !== 0
            ? card.order
            : card.order === 0
              ? 0
              : idx + 1,
      }));

      currentCards.sort((a, b) => parseOrder(a.order) - parseOrder(b.order));

      const cardsChanged = JSON.stringify(currentCards) !== JSON.stringify(globalClients?.cards || []);
      if (cardsChanged) {
        await req.payload.updateGlobal({
          slug: "clients-index",
          data: { cards: currentCards },
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else {
      const filtered = currentCards.filter((card) => !isMatch(card));
      if (filtered.length !== currentCards.length) {
        await req.payload.updateGlobal({
          slug: "clients-index",
          data: { cards: filtered },
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Clients Page global for client ${clientId}`,
    });
  }

  // 6. Work Page Global Sync (/work)
  try {
    const wpConfig = placements.workPage;
    const globalWork = (await req.payload.findGlobal({
      slug: "work-page",
      depth: 0,
      req,
    })) as { projects?: Array<Record<string, unknown>> };

    let currentProjects = Array.isArray(globalWork?.projects)
      ? [...globalWork.projects]
      : [];

    const isMatch = (proj: Record<string, unknown>) => {
      const projHref = String(proj.href || "");
      const projName = String(proj.name || "").toLowerCase();
      return (
        (clientPath && projHref === clientPath) ||
        projName === clientName.toLowerCase()
      );
    };

    if (wpConfig?.enabled) {
      const projectImageId = extractId(wpConfig.image) || defaultHeroImageId;
      const projectOrder = parseOrder(wpConfig.order, 0);
      const projectData = {
        name: clientName,
        service: wpConfig.service || defaultHeroHeading || "",
        category: wpConfig.category || "technology",
        image: projectImageId || null,
        href: clientPath || "#",
        order: projectOrder,
      };

      const matchIndex = currentProjects.findIndex(isMatch);
      if (matchIndex >= 0) {
        currentProjects[matchIndex] = {
          ...currentProjects[matchIndex],
          ...projectData,
        };
      } else {
        currentProjects.push(projectData);
      }

      currentProjects = currentProjects.map((proj, idx) => ({
        ...proj,
        order:
          typeof proj.order === "number" && proj.order !== 0
            ? proj.order
            : proj.order === 0
              ? 0
              : idx + 1,
      }));

      currentProjects.sort((a, b) => parseOrder(a.order) - parseOrder(b.order));

      const projectsChanged = JSON.stringify(currentProjects) !== JSON.stringify(globalWork?.projects || []);
      if (projectsChanged) {
        await req.payload.updateGlobal({
          slug: "work-page",
          data: { projects: currentProjects },
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    } else {
      const filtered = currentProjects.filter((proj) => !isMatch(proj));
      if (filtered.length !== currentProjects.length) {
        await req.payload.updateGlobal({
          slug: "work-page",
          data: { projects: filtered },
          context: { skipSync: true, skipRevalidation: true },
          req,
        });
      }
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Work Page global for client ${clientId}`,
    });
  }

  return doc;
};


/**
 * Reverse sync: Updates the parent Client record when Featured Projects is changed.
 */
export const syncFeaturedProjectToClient: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          featuredProject: {
            enabled: true,
            metric: doc.metric || "",
            metricLabel: doc.metricLabel || "",
            description: doc.description || "",
            image: extractId(doc.image),
            alt: doc.alt || "",
            order: typeof doc.order === "number" ? doc.order : 0,
          },
        },
      } as never,
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse sync failed from Featured Project ${doc.id} to client ${clientId}`,
    });
  }
  return doc;
};

export const syncFeaturedProjectDeleteToClient: CollectionAfterDeleteHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc?.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    const existingFP = (placements.featuredProject as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          featuredProject: {
            ...existingFP,
            enabled: false,
          },
        },
      },
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse delete sync failed from Featured Project ${doc?.id} to client ${clientId}`,
    });
  }
  return doc;
};

/**
 * Reverse sync: Updates the parent Client record when Portfolio Item is changed.
 */
export const syncPortfolioItemToClient: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          portfolioItem: {
            enabled: true,
            category: doc.category || "",
            image: extractId(doc.image),
            alt: doc.alt || "",
            order: typeof doc.order === "number" ? doc.order : 0,
          },
        },
      } as never,
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse sync failed from Portfolio Item ${doc.id} to client ${clientId}`,
    });
  }
  return doc;
};

export const syncPortfolioItemDeleteToClient: CollectionAfterDeleteHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc?.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    const existingPI = (placements.portfolioItem as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          portfolioItem: {
            ...existingPI,
            enabled: false,
          },
        },
      },
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse delete sync failed from Portfolio Item ${doc?.id} to client ${clientId}`,
    });
  }
  return doc;
};

/**
 * Reverse sync: Updates the parent Client record when Pain Point is changed.
 */
export const syncPainPointToClient: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          painPoint: {
            enabled: true,
            tag: doc.tag || "",
            quote: doc.quote || "",
            resolution: doc.resolution || "",
            order: typeof doc.order === "number" ? doc.order : 0,
          },
        },
      },
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse sync failed from Pain Point ${doc.id} to client ${clientId}`,
    });
  }
  return doc;
};

export const syncPainPointDeleteToClient: CollectionAfterDeleteHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const clientId = extractId(doc?.client);
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    const existingPP = (placements.painPoint as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          painPoint: {
            ...existingPP,
            enabled: false,
          },
        },
      },
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse delete sync failed from Pain Point ${doc?.id} to client ${clientId}`,
    });
  }
  return doc;
};

/**
 * Reverse sync: Updates the parent Client record when Homepage Case Study is changed.
 */
export const syncHomepageCaseStudyToClient: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const studyId = extractId(doc.caseStudy);
  let clientId = extractId(doc.client);

  if (!clientId && studyId) {
    try {
      const study = await req.payload.findByID({
        collection: "case-studies",
        id: studyId,
        depth: 0,
        req,
      });
      clientId = extractId(study?.client);
    } catch {}
  }
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          homepageCaseStudy: {
            enabled: true,
            caseStudy: studyId || null,
            number: doc.number || "",
            description: doc.description || "",
            tags: doc.tags || [],
            order: parseOrder(doc.order, 0),
          },
        },
      } as never,
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse sync failed from Homepage Case Study ${doc.id} to client`,
    });
  }
  return doc;
};

export const syncHomepageCaseStudyDeleteToClient: CollectionAfterDeleteHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipSync) return doc;
  const studyId = extractId(doc?.caseStudy);
  let clientId = extractId(doc?.client);

  if (!clientId && studyId) {
    try {
      const study = await req.payload.findByID({
        collection: "case-studies",
        id: studyId,
        depth: 0,
        req,
      });
      clientId = extractId(study?.client);
    } catch {}
  }
  if (!clientId) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const placements = (client.placements as Record<string, unknown>) || {};
    const existingHCS =
      (placements.homepageCaseStudy as Record<string, unknown>) || {};
    await req.payload.update({
      collection: "clients",
      id: clientId,
      data: {
        placements: {
          ...placements,
          homepageCaseStudy: {
            ...existingHCS,
            enabled: false,
          },
        },
      },
      context: { skipSync: true, skipRevalidation: true },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse delete sync failed from Homepage Case Study ${doc?.id} to client`,
    });
  }
  return doc;
};
