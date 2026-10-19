import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

function extractId(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "object" && "id" in value) {
    const id = (value as { id: unknown }).id;
    if (typeof id === "number") return id;
    if (typeof id === "string") {
      const parsed = Number(id);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Triggered after a Client document changes.
 * Syncs the configured placements to their respective collections & globals.
 */
export const syncClientPlacementsAfterChange: CollectionAfterChangeHook = async ({
  doc,
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

  // 1. Featured Projects Sync
  try {
    const fpConfig = placements.featuredProject;
    const existingFP = await req.payload.find({
      collection: "featured-projects",
      where: { client: { equals: clientId } },
      limit: 1,
      depth: 0,
    });
    const fpDoc = existingFP.docs[0];

    if (fpConfig?.enabled) {
      const imgId = extractId(fpConfig.image);
      const data: Record<string, unknown> = {
        name: clientName,
        description: fpConfig.description || "",
        metric: fpConfig.metric || "",
        metricLabel: fpConfig.metricLabel || "",
        alt: fpConfig.alt || `${clientName} preview`,
        order: typeof fpConfig.order === "number" ? fpConfig.order : 0,
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
          context: { skipSync: true },
        });
      } else if (imgId != null) {
        await req.payload.create({
          collection: "featured-projects",
          data: data as never,
          context: { skipSync: true },
        });
      }
    } else if (fpDoc) {
      await req.payload.delete({
        collection: "featured-projects",
        id: fpDoc.id,
        context: { skipSync: true },
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
    });
    const piDoc = existingPI.docs[0];

    if (piConfig?.enabled) {
      const imgId = extractId(piConfig.image);
      const data: Record<string, unknown> = {
        name: clientName,
        category: piConfig.category || "Brand & Web",
        alt: piConfig.alt || `${clientName} portfolio visual`,
        order: typeof piConfig.order === "number" ? piConfig.order : 0,
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
          context: { skipSync: true },
        });
      } else if (imgId != null) {
        await req.payload.create({
          collection: "portfolio-items",
          data: data as never,
          context: { skipSync: true },
        });
      }
    } else if (piDoc) {
      await req.payload.delete({
        collection: "portfolio-items",
        id: piDoc.id,
        context: { skipSync: true },
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
    });
    const ppDoc = existingPP.docs[0];

    if (ppConfig?.enabled) {
      const data = {
        tag: ppConfig.tag || clientName,
        quote: ppConfig.quote || "",
        resolution: ppConfig.resolution || "",
        order: typeof ppConfig.order === "number" ? ppConfig.order : 0,
        client: clientId,
      };

      if (ppDoc) {
        await req.payload.update({
          collection: "pain-points",
          id: ppDoc.id,
          data,
          context: { skipSync: true },
        });
      } else if (data.quote && data.resolution) {
        await req.payload.create({
          collection: "pain-points",
          data: data as never,
          context: { skipSync: true },
        });
      }
    } else if (ppDoc) {
      await req.payload.delete({
        collection: "pain-points",
        id: ppDoc.id,
        context: { skipSync: true },
      });
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Pain Point for client ${clientId}`,
    });
  }

  // 4. Homepage Case Studies Sync
  try {
    const hcsConfig = placements.homepageCaseStudy;
    const targetStudyId =
      extractId(hcsConfig?.caseStudy) || extractId(doc.featuredStudy);

    if (targetStudyId) {
      const existingHCS = await req.payload.find({
        collection: "homepage-case-studies",
        where: { caseStudy: { equals: targetStudyId } },
        limit: 1,
        depth: 0,
      });
      const hcsDoc = existingHCS.docs[0];

      if (hcsConfig?.enabled) {
        const data = {
          number: hcsConfig.number || "01",
          name: clientName,
          description: hcsConfig.description || "",
          tags: Array.isArray(hcsConfig.tags) ? hcsConfig.tags : [],
          order: typeof hcsConfig.order === "number" ? hcsConfig.order : 0,
          caseStudy: targetStudyId,
        };

        if (hcsDoc) {
          await req.payload.update({
            collection: "homepage-case-studies",
            id: hcsDoc.id,
            data: data as never,
            context: { skipSync: true },
          });
        } else {
          await req.payload.create({
            collection: "homepage-case-studies",
            data: data as never,
            context: { skipSync: true },
          });
        }
      } else if (hcsDoc) {
        await req.payload.delete({
          collection: "homepage-case-studies",
          id: hcsDoc.id,
          context: { skipSync: true },
        });
      }
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Homepage Case Study for client ${clientId}`,
    });
  }

  // 5. Clients Page Global Sync
  try {
    const cpConfig = placements.clientsPage;
    const globalClients = (await req.payload.findGlobal({
      slug: "clients-index",
      depth: 0,
    })) as { cards?: Array<Record<string, unknown>> };

    const currentCards = Array.isArray(globalClients?.cards)
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
      const cardData = {
        name: clientName,
        service: cpConfig.service || "",
        image: extractId(cpConfig.image),
        href: clientPath || "#",
      };

      const matchIndex = currentCards.findIndex(isMatch);
      if (matchIndex >= 0) {
        currentCards[matchIndex] = {
          ...currentCards[matchIndex],
          ...cardData,
          image: cardData.image || currentCards[matchIndex].image,
        };
      } else {
        currentCards.push(cardData);
      }

      await req.payload.updateGlobal({
        slug: "clients-index",
        data: { cards: currentCards },
        context: { skipSync: true },
      });
    } else {
      const filtered = currentCards.filter((card) => !isMatch(card));
      if (filtered.length !== currentCards.length) {
        await req.payload.updateGlobal({
          slug: "clients-index",
          data: { cards: filtered },
          context: { skipSync: true },
        });
      }
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not sync Clients Page global for client ${clientId}`,
    });
  }

  // 6. Work Page Global Sync
  try {
    const wpConfig = placements.workPage;
    const globalWork = (await req.payload.findGlobal({
      slug: "work-page",
      depth: 0,
    })) as { projects?: Array<Record<string, unknown>> };

    const currentProjects = Array.isArray(globalWork?.projects)
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
      const projectData = {
        name: clientName,
        service: wpConfig.service || "",
        category: wpConfig.category || "technology",
        image: extractId(wpConfig.image),
        href: clientPath || "#",
      };

      const matchIndex = currentProjects.findIndex(isMatch);
      if (matchIndex >= 0) {
        currentProjects[matchIndex] = {
          ...currentProjects[matchIndex],
          ...projectData,
          image: projectData.image || currentProjects[matchIndex].image,
        };
      } else {
        currentProjects.push(projectData);
      }

      await req.payload.updateGlobal({
        slug: "work-page",
        data: { projects: currentProjects },
        context: { skipSync: true },
      });
    } else {
      const filtered = currentProjects.filter((proj) => !isMatch(proj));
      if (filtered.length !== currentProjects.length) {
        await req.payload.updateGlobal({
          slug: "work-page",
          data: { projects: filtered },
          context: { skipSync: true },
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
      context: { skipSync: true },
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
      context: { skipSync: true },
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
      context: { skipSync: true },
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
      context: { skipSync: true },
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
      context: { skipSync: true },
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
      context: { skipSync: true },
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
  if (!studyId) return doc;

  try {
    const study = await req.payload.findByID({
      collection: "case-studies",
      id: studyId,
      depth: 0,
    });
    const clientId = extractId(study?.client);
    if (!clientId) return doc;

    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
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
            caseStudy: studyId,
            number: doc.number || "",
            description: doc.description || "",
            tags: doc.tags || [],
            order: typeof doc.order === "number" ? doc.order : 0,
          },
        },
      } as never,
      context: { skipSync: true },
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
  if (!studyId) return doc;

  try {
    const study = await req.payload.findByID({
      collection: "case-studies",
      id: studyId,
      depth: 0,
    });
    const clientId = extractId(study?.client);
    if (!clientId) return doc;

    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
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
      context: { skipSync: true },
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Reverse delete sync failed from Homepage Case Study ${doc?.id} to client`,
    });
  }
  return doc;
};
