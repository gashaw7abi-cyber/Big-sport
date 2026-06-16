import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    app.use(express.static(distPath));
    app.get('/ads.txt', (req, res) => {
      res.sendFile(path.join(distPath, 'ads.txt'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
