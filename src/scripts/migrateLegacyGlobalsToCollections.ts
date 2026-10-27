import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Starting migration of legacy Branding & Manufacturing data...");
    await client.query("BEGIN;");

    // 1. Get or ensure service_pages for 'brand-systems'
    let servicePageRes = await client.query(
      `SELECT id FROM service_pages WHERE slug = 'brand-systems' LIMIT 1;`
    );
    let servicePageId: number;
    if (servicePageRes.rows.length === 0) {
      const ins = await client.query(
        `INSERT INTO service_pages (title, slug, created_at, updated_at) 
         VALUES ('Brand Systems', 'brand-systems', NOW(), NOW()) RETURNING id;`
      );
      servicePageId = ins.rows[0].id;
    } else {
      servicePageId = servicePageRes.rows[0].id;
    }
    console.log(`Target service_pages id: ${servicePageId}`);

    // Update main service_pages columns from branding_strategy
    const bsRes = await client.query(`SELECT * FROM branding_strategy LIMIT 1;`);
    if (bsRes.rows.length > 0) {
      const bs = bsRes.rows[0];
      await client.query(
        `UPDATE service_pages SET
          breadcrumb_current = COALESCE($1, breadcrumb_current),
          hero_title = COALESCE($2, hero_title),
          hero_intro = COALESCE($3, hero_intro),
          hero_image_id = COALESCE($4, hero_image_id),
          lead = COALESCE($5, lead),
          clients_before = COALESCE($6, clients_before),
          clients_accent = COALESCE($7, clients_accent),
          clients_after = COALESCE($8, clients_after),
          experts_before = COALESCE($9, experts_before),
          experts_accent = COALESCE($10, experts_accent),
          experts_subheading = COALESCE($11, experts_subheading),
          related_before = COALESCE($12, related_before),
          related_accent = COALESCE($13, related_accent),
          updated_at = NOW()
        WHERE id = $14;`,
        [
          bs.breadcrumb_current,
          bs.hero_title,
          bs.hero_intro,
          bs.hero_image_id,
          bs.lead,
          bs.clients_before,
          bs.clients_accent,
          bs.clients_after,
          bs.experts_before,
          bs.experts_accent,
          bs.experts_subheading,
          bs.related_before,
          bs.related_accent,
          servicePageId,
        ]
      );
      console.log("Updated service_pages main columns from branding_strategy.");
    }

    // Clear existing empty/child rows in service_pages child tables for this page
    await client.query(`DELETE FROM service_pages_sections_paragraphs WHERE _parent_id IN (SELECT id FROM service_pages_sections WHERE _parent_id = $1);`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_sections_pointers WHERE _parent_id IN (SELECT id FROM service_pages_sections WHERE _parent_id = $1);`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_sections_closing WHERE _parent_id IN (SELECT id FROM service_pages_sections WHERE _parent_id = $1);`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_sections WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_faqs WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_client_tabs WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_projects WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_experts WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_related_blogs WHERE _parent_id = $1;`, [servicePageId]);
    await client.query(`DELETE FROM service_pages_logos WHERE _parent_id = $1;`, [servicePageId]);

    // Copy branding_strategy_sections
    const bsSections = await client.query(`SELECT * FROM branding_strategy_sections ORDER BY _order ASC;`);
    for (const sec of bsSections.rows) {
      await client.query(
        `INSERT INTO service_pages_sections (
          _order, _parent_id, id, anchor, toc_label, heading_before, heading_accent, heading_after, highlight_title, highlight_body
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [
          sec._order,
          servicePageId,
          sec.id,
          sec.anchor,
          sec.toc_label,
          sec.heading_before,
          sec.heading_accent,
          sec.heading_after,
          sec.highlight_title,
          sec.highlight_body,
        ]
      );
    }
    console.log(`Copied ${bsSections.rows.length} sections to service_pages_sections.`);

    // Copy branding_strategy_sections_paragraphs
    const bsParas = await client.query(`SELECT * FROM branding_strategy_sections_paragraphs ORDER BY _order ASC;`);
    for (const p of bsParas.rows) {
      await client.query(
        `INSERT INTO service_pages_sections_paragraphs (_order, _parent_id, id, text)
         VALUES ($1, $2, $3, $4);`,
        [p._order, p._parent_id, p.id, p.text]
      );
    }
    console.log(`Copied ${bsParas.rows.length} paragraphs to service_pages_sections_paragraphs.`);

    // Copy branding_strategy_sections_pointers
    const bsPointers = await client.query(`SELECT * FROM branding_strategy_sections_pointers ORDER BY _order ASC;`);
    for (const ptr of bsPointers.rows) {
      await client.query(
        `INSERT INTO service_pages_sections_pointers (_order, _parent_id, id, term, text)
         VALUES ($1, $2, $3, $4, $5);`,
        [ptr._order, ptr._parent_id, ptr.id, ptr.term, ptr.text]
      );
    }
    console.log(`Copied ${bsPointers.rows.length} pointers to service_pages_sections_pointers.`);

    // Copy branding_strategy_sections_closing
    const bsClosing = await client.query(`SELECT * FROM branding_strategy_sections_closing ORDER BY _order ASC;`);
    for (const c of bsClosing.rows) {
      await client.query(
        `INSERT INTO service_pages_sections_closing (_order, _parent_id, id, text)
         VALUES ($1, $2, $3, $4);`,
        [c._order, c._parent_id, c.id, c.text]
      );
    }
    console.log(`Copied ${bsClosing.rows.length} closing lines to service_pages_sections_closing.`);

    // Copy branding_strategy_faqs
    const bsFaqs = await client.query(`SELECT * FROM branding_strategy_faqs ORDER BY _order ASC;`);
    for (const f of bsFaqs.rows) {
      await client.query(
        `INSERT INTO service_pages_faqs (_order, _parent_id, id, question, answer)
         VALUES ($1, $2, $3, $4, $5);`,
        [f._order, servicePageId, f.id, f.question, f.answer]
      );
    }
    console.log(`Copied ${bsFaqs.rows.length} FAQs to service_pages_faqs.`);

    // Copy branding_strategy_client_tabs
    const bsTabs = await client.query(`SELECT * FROM branding_strategy_client_tabs ORDER BY _order ASC;`);
    for (const t of bsTabs.rows) {
      await client.query(
        `INSERT INTO service_pages_client_tabs (_order, _parent_id, id, tab_id, label)
         VALUES ($1, $2, $3, $4, $5);`,
        [t._order, servicePageId, t.id, t.tab_id, t.label]
      );
    }
    console.log(`Copied ${bsTabs.rows.length} tabs to service_pages_client_tabs.`);

    // Copy branding_strategy_projects
    const bsProjects = await client.query(`SELECT * FROM branding_strategy_projects ORDER BY _order ASC;`);
    for (const proj of bsProjects.rows) {
      await client.query(
        `INSERT INTO service_pages_projects (_order, _parent_id, id, image_id, name, description, href, tab)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [proj._order, servicePageId, proj.id, proj.image_id, proj.name, proj.description, proj.href, proj.tab]
      );
    }
    console.log(`Copied ${bsProjects.rows.length} projects to service_pages_projects.`);

    // Copy branding_strategy_experts
    const bsExperts = await client.query(`SELECT * FROM branding_strategy_experts ORDER BY _order ASC;`);
    for (const exp of bsExperts.rows) {
      await client.query(
        `INSERT INTO service_pages_experts (_order, _parent_id, id, image_id, name, role, read_more_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [exp._order, servicePageId, exp.id, exp.image_id, exp.name, exp.role, exp.read_more_url]
      );
    }
    console.log(`Copied ${bsExperts.rows.length} experts to service_pages_experts.`);

    // Copy branding_strategy_related_blogs
    const bsBlogs = await client.query(`SELECT * FROM branding_strategy_related_blogs ORDER BY _order ASC;`);
    for (const b of bsBlogs.rows) {
      await client.query(
        `INSERT INTO service_pages_related_blogs (_order, _parent_id, id, image_id, date, read_time, title, href)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [b._order, servicePageId, b.id, b.image_id, b.date, b.read_time, b.title, b.href]
      );
    }
    console.log(`Copied ${bsBlogs.rows.length} blogs to service_pages_related_blogs.`);

    // Copy branding_strategy_logos
    const bsLogos = await client.query(`SELECT * FROM branding_strategy_logos ORDER BY _order ASC;`);
    for (const l of bsLogos.rows) {
      await client.query(
        `INSERT INTO service_pages_logos (_order, _parent_id, id, image_id, name, width, height, row)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [l._order, servicePageId, l.id, l.image_id, l.name, l.width, l.height, l.row]
      );
    }
    console.log(`Copied ${bsLogos.rows.length} logos to service_pages_logos.`);

    // =========================================================================
    // 2. INDUSTRY PAGES: 'manufacturing'
    // =========================================================================
    let industryPageRes = await client.query(
      `SELECT id FROM industry_pages WHERE slug = 'manufacturing' LIMIT 1;`
    );
    let industryPageId: number;
    if (industryPageRes.rows.length === 0) {
      const ins = await client.query(
        `INSERT INTO industry_pages (title, slug, created_at, updated_at) 
         VALUES ('Manufacturing', 'manufacturing', NOW(), NOW()) RETURNING id;`
      );
      industryPageId = ins.rows[0].id;
    } else {
      industryPageId = industryPageRes.rows[0].id;
    }
    console.log(`Target industry_pages id: ${industryPageId}`);

    // Update main industry_pages columns from manufacturing_industry
    const miRes = await client.query(`SELECT * FROM manufacturing_industry LIMIT 1;`);
    if (miRes.rows.length > 0) {
      const mi = miRes.rows[0];
      await client.query(
        `UPDATE industry_pages SET
          breadcrumb_current = COALESCE($1, breadcrumb_current),
          hero_title = COALESCE($2, hero_title),
          hero_intro = COALESCE($3, hero_intro),
          hero_image_id = COALESCE($4, hero_image_id),
          lead = COALESCE($5, lead),
          clients_before = COALESCE($6, clients_before),
          clients_accent = COALESCE($7, clients_accent),
          clients_after = COALESCE($8, clients_after),
          experts_before = COALESCE($9, experts_before),
          experts_accent = COALESCE($10, experts_accent),
          experts_subheading = COALESCE($11, experts_subheading),
          related_before = COALESCE($12, related_before),
          related_accent = COALESCE($13, related_accent),
          updated_at = NOW()
        WHERE id = $14;`,
        [
          mi.breadcrumb_current,
          mi.hero_title,
          mi.hero_intro,
          mi.hero_image_id,
          mi.lead,
          mi.clients_before,
          mi.clients_accent,
          mi.clients_after,
          mi.experts_before,
          mi.experts_accent,
          mi.experts_subheading,
          mi.related_before,
          mi.related_accent,
          industryPageId,
        ]
      );
      console.log("Updated industry_pages main columns from manufacturing_industry.");
    }

    // Clear existing empty/child rows in industry_pages child tables for this page
    await client.query(`DELETE FROM industry_pages_preface WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_sections_paragraphs WHERE _parent_id IN (SELECT id FROM industry_pages_sections WHERE _parent_id = $1);`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_sections_blocks_paragraphs WHERE _parent_id IN (
      SELECT b.id FROM industry_pages_sections_blocks b 
      JOIN industry_pages_sections s ON b._parent_id = s.id 
      WHERE s._parent_id = $1
    );`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_sections_blocks WHERE _parent_id IN (SELECT id FROM industry_pages_sections WHERE _parent_id = $1);`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_sections WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_faqs WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_client_tabs WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_projects WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_experts WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_related_blogs WHERE _parent_id = $1;`, [industryPageId]);
    await client.query(`DELETE FROM industry_pages_logos WHERE _parent_id = $1;`, [industryPageId]);

    // Copy manufacturing_industry_preface
    const miPreface = await client.query(`SELECT * FROM manufacturing_industry_preface ORDER BY _order ASC;`);
    for (const pref of miPreface.rows) {
      await client.query(
        `INSERT INTO industry_pages_preface (_order, _parent_id, id, text)
         VALUES ($1, $2, $3, $4);`,
        [pref._order, industryPageId, pref.id, pref.text]
      );
    }
    console.log(`Copied ${miPreface.rows.length} preface paragraphs to industry_pages_preface.`);

    // Copy manufacturing_industry_sections
    const miSections = await client.query(`SELECT * FROM manufacturing_industry_sections ORDER BY _order ASC;`);
    for (const sec of miSections.rows) {
      await client.query(
        `INSERT INTO industry_pages_sections (
          _order, _parent_id, id, anchor, toc_label, heading_before, heading_accent, heading_after, highlight_title, highlight_body
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [
          sec._order,
          industryPageId,
          sec.id,
          sec.anchor,
          sec.toc_label,
          sec.heading_before,
          sec.heading_accent,
          sec.heading_after,
          sec.highlight_title,
          sec.highlight_body,
        ]
      );
    }
    console.log(`Copied ${miSections.rows.length} sections to industry_pages_sections.`);

    // Copy manufacturing_industry_sections_paragraphs
    const miParas = await client.query(`SELECT * FROM manufacturing_industry_sections_paragraphs ORDER BY _order ASC;`);
    for (const p of miParas.rows) {
      await client.query(
        `INSERT INTO industry_pages_sections_paragraphs (_order, _parent_id, id, text)
         VALUES ($1, $2, $3, $4);`,
        [p._order, p._parent_id, p.id, p.text]
      );
    }
    console.log(`Copied ${miParas.rows.length} paragraphs to industry_pages_sections_paragraphs.`);

    // Copy manufacturing_industry_sections_blocks
    const miBlocks = await client.query(`SELECT * FROM manufacturing_industry_sections_blocks ORDER BY _order ASC;`);
    for (const blk of miBlocks.rows) {
      await client.query(
        `INSERT INTO industry_pages_sections_blocks (_order, _parent_id, id, title)
         VALUES ($1, $2, $3, $4);`,
        [blk._order, blk._parent_id, blk.id, blk.title]
      );
    }
    console.log(`Copied ${miBlocks.rows.length} blocks to industry_pages_sections_blocks.`);

    // Copy manufacturing_industry_sections_blocks_paragraphs
    const miBlockParas = await client.query(`SELECT * FROM manufacturing_industry_sections_blocks_paragraphs ORDER BY _order ASC;`);
    for (const bp of miBlockParas.rows) {
      await client.query(
        `INSERT INTO industry_pages_sections_blocks_paragraphs (_order, _parent_id, id, text)
         VALUES ($1, $2, $3, $4);`,
        [bp._order, bp._parent_id, bp.id, bp.text]
      );
    }
    console.log(`Copied ${miBlockParas.rows.length} block paragraphs to industry_pages_sections_blocks_paragraphs.`);

    // Copy manufacturing_industry_faqs
    const miFaqs = await client.query(`SELECT * FROM manufacturing_industry_faqs ORDER BY _order ASC;`);
    for (const f of miFaqs.rows) {
      await client.query(
        `INSERT INTO industry_pages_faqs (_order, _parent_id, id, question, answer)
         VALUES ($1, $2, $3, $4, $5);`,
        [f._order, industryPageId, f.id, f.question, f.answer]
      );
    }
    console.log(`Copied ${miFaqs.rows.length} FAQs to industry_pages_faqs.`);

    // Copy manufacturing_industry_client_tabs
    const miTabs = await client.query(`SELECT * FROM manufacturing_industry_client_tabs ORDER BY _order ASC;`);
    for (const t of miTabs.rows) {
      await client.query(
        `INSERT INTO industry_pages_client_tabs (_order, _parent_id, id, tab_id, label)
         VALUES ($1, $2, $3, $4, $5);`,
        [t._order, industryPageId, t.id, t.tab_id, t.label]
      );
    }
    console.log(`Copied ${miTabs.rows.length} tabs to industry_pages_client_tabs.`);

    // Copy manufacturing_industry_projects
    const miProjects = await client.query(`SELECT * FROM manufacturing_industry_projects ORDER BY _order ASC;`);
    for (const proj of miProjects.rows) {
      await client.query(
        `INSERT INTO industry_pages_projects (_order, _parent_id, id, image_id, name, description, href, tab)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [proj._order, industryPageId, proj.id, proj.image_id, proj.name, proj.description, proj.href, proj.tab]
      );
    }
    console.log(`Copied ${miProjects.rows.length} projects to industry_pages_projects.`);

    // Copy manufacturing_industry_experts
    const miExperts = await client.query(`SELECT * FROM manufacturing_industry_experts ORDER BY _order ASC;`);
    for (const exp of miExperts.rows) {
      await client.query(
        `INSERT INTO industry_pages_experts (_order, _parent_id, id, image_id, name, role, read_more_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [exp._order, industryPageId, exp.id, exp.image_id, exp.name, exp.role, exp.read_more_url]
      );
    }
    console.log(`Copied ${miExperts.rows.length} experts to industry_pages_experts.`);

    // Copy manufacturing_industry_related_blogs
    const miBlogs = await client.query(`SELECT * FROM manufacturing_industry_related_blogs ORDER BY _order ASC;`);
    for (const b of miBlogs.rows) {
      await client.query(
        `INSERT INTO industry_pages_related_blogs (_order, _parent_id, id, image_id, date, read_time, title, href)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [b._order, industryPageId, b.id, b.image_id, b.date, b.read_time, b.title, b.href]
      );
    }
    console.log(`Copied ${miBlogs.rows.length} blogs to industry_pages_related_blogs.`);

    // Copy manufacturing_industry_logos
    const miLogos = await client.query(`SELECT * FROM manufacturing_industry_logos ORDER BY _order ASC;`);
    for (const l of miLogos.rows) {
      await client.query(
        `INSERT INTO industry_pages_logos (_order, _parent_id, id, image_id, name, width, height, row)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [l._order, industryPageId, l.id, l.image_id, l.name, l.width, l.height, l.row]
      );
    }
    console.log(`Copied ${miLogos.rows.length} logos to industry_pages_logos.`);

    await client.query("COMMIT;");
    console.log("Migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK;");
    console.error("Migration failed, rolled back:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
