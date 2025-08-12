const fs = require('fs');
const path = require('path');

// Sitemap configuration
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://viencongnghe.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Define all pages with their metadata
const pages = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/about',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/products',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/organization',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/research',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/blog',
    priority: 0.8,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/contact',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate sitemap XML content
function generateSitemapXML() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  pages.forEach(page => {
    const url = `${BASE_URL}${page.path}`;
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// Generate robots.txt content
function generateRobotsTxt() {
  let robots = `User-agent: *\n`;
  robots += `Allow: /\n\n`;
  robots += `Sitemap: ${BASE_URL}/sitemap.xml\n`;
  robots += `Host: ${BASE_URL}\n\n`;
  robots += `# Crawl-delay for respectful crawling\n`;
  robots += `Crawl-delay: 1\n`;

  return robots;
}

// Main function
function main() {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate and write sitemap.xml
    const sitemapXML = generateSitemapXML();
    fs.writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${OUTPUT_PATH}`);

    // Generate and write robots.txt
    const robotsTxtPath = path.join(publicDir, 'robots.txt');
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(robotsTxtPath, robotsTxt, 'utf8');
    console.log(`✅ Robots.txt generated successfully: ${robotsTxtPath}`);

    // Generate sitemap index for multiple sitemaps (if needed in the future)
    const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');
    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
    fs.writeFileSync(sitemapIndexPath, sitemapIndexXML, 'utf8');
    console.log(`✅ Sitemap index generated successfully: ${sitemapIndexPath}`);

    console.log('\n📊 Sitemap Statistics:');
    console.log(`   - Total pages: ${pages.length}`);
    console.log(`   - Base URL: ${BASE_URL}`);
    console.log(`   - Generated: ${new Date().toISOString()}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateSitemapXML, generateRobotsTxt, main };
