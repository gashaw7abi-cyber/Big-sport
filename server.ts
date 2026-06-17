import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/share", (req, res) => {
    const { title, desc, image, redirect } = req.query;
    const safeTitle = String(title || "News").replace(/"/g, '&quot;');
    const safeDesc = String(desc || "").replace(/"/g, '&quot;');
    const safeImage = String(image || "").replace(/"/g, '&quot;');
    const safeRedirect = String(redirect || "/").replace(/"/g, '&quot;');

    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeTitle}</title>
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">
  <meta http-equiv="refresh" content="0;url=${safeRedirect}">
</head>
<body>
  <p>Redirecting to <a href="${safeRedirect}">the article</a>...</p>
</body>
</html>`);
  });

// Proxy for ESPN Sports News Api (Multiple Leagues)
  let newsCache: { data: any[]; lastFetched: number } | null = null;
  const NEWS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  app.get("/api/news", async (req, res) => {
    const now = Date.now();
    if (newsCache && (now - newsCache.lastFetched < NEWS_CACHE_TTL)) {
      return res.json(newsCache.data);
    }

    try {
      const leagues = ['eng.1', 'eng.2', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'uefa.europa', 'uefa.europa.conf'];
      let allArticles: any[] = [];
      
      await Promise.all(leagues.map(async (league) => {
        try {
          const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/news?limit=30`);
          if (response.ok) {
            const data = await response.json();
            if (data.articles && data.articles.length > 0) {
              allArticles.push(...data.articles);
            }
          }
        } catch (e) {
           // ignore error for single league
        }
      }));
      
      // Deduplicate by id if needed, though they shouldn't overlap much
      const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.dataSourceIdentifier || a.headline, a])).values());
      // Sort by published descending
      uniqueArticles.sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime());
      
      // Save to cache
      if (uniqueArticles.length > 0) {
        newsCache = {
          data: uniqueArticles,
          lastFetched: now
        };
      }
      
      res.json(uniqueArticles.length > 0 ? uniqueArticles : (newsCache ? newsCache.data : []));
    } catch (error) {
      console.error(error);
      if (newsCache) {
        res.json(newsCache.data);
      } else {
        res.status(500).json({ error: "Failed to fetch news" });
      }
    }
  });

  // Proxy for ESPN Sports Scores Api (Multiple Leagues)
  app.get("/api/scores", async (req, res) => {
    try {
      const today = new Date();
      const past = new Date(today);
      past.setDate(today.getDate() - 14); // get up to two weeks past
      const future = new Date(today);
      future.setDate(today.getDate() + 7); // get upcoming week

      const fd = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
      const dates = `${fd(past)}-${fd(future)}`;

      const leagues = ['eng.1', 'eng.2', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'uefa.europa', 'uefa.europa.conf'];
      let allEvents: any[] = [];

      await Promise.all(leagues.map(async (league) => {
        try {
          const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${dates}`);
          if (response.ok) {
            const data = await response.json();
            if (data.events) {
              const eventsWithLeague = data.events.map((e: any) => ({ ...e, _league: league }));
              allEvents.push(...eventsWithLeague);
            }
          }
        } catch (e) {
           // ignore
        }
      }));

      res.json(allEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch scores" });
    }
  });

  // Proxy for ESPN Match Summary Api
  app.get("/api/summary", async (req, res) => {
    try {
      const { league, event } = req.query;
      if (!league || !event) {
        return res.status(400).json({ error: "Missing league or event parameter" });
      }
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${event}`);
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch from ESPN" });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch summary" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.get('/ads.txt', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'public', 'ads.txt'));
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('/ads.txt', (req, res) => {
      res.sendFile(path.join(distPath, 'ads.txt'));
    });
    app.get('*', (req, res) => {
      let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      
      const { og_title, og_desc, og_image } = req.query;
      
      if (og_title || og_desc || og_image) {
        if (og_title) {
          const safeTitle = String(og_title).replace(/"/g, '&quot;');
          html = html.replace(/<title>.*<\/title>/, `<title>${safeTitle}</title>`);
          html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${safeTitle}"`);
          html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${safeTitle}"`);
        }
        if (og_desc) {
          const safeDesc = String(og_desc).replace(/"/g, '&quot;');
          html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${safeDesc}"`);
          html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${safeDesc}"`);
          html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${safeDesc}"`);
        }
        if (og_image) {
          const safeImage = String(og_image).replace(/"/g, '&quot;');
          html = html.replace(/<\/head>/i, `<meta property="og:image" content="${safeImage}" />\n<meta name="twitter:image" content="${safeImage}" />\n</head>`);
        }
      }
      
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
