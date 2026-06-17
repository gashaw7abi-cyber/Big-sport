const leagues = ['eng.1', 'eng.2', 'esp.1', 'ita.1', 'ger.1', 'fra.1', 'uefa.champions', 'uefa.europa', 'uefa.europa.conf'];

export const fetchEspnNews = async () => {
  try {
    const response = await fetch('/api/news');
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    }
    throw new Error("Local news API failed or returned non-JSON/empty");
  } catch (error) {
    console.warn("Falling back to direct ESPN API news fetching:", error);
    
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

    const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.dataSourceIdentifier || a.headline, a])).values());
    uniqueArticles.sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime());
    return uniqueArticles;
  }
};

export const fetchEspnScores = async () => {
  try {
    const response = await fetch('/api/scores');
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    }
    throw new Error("Local scores API failed or returned non-JSON/empty");
  } catch (error) {
    console.warn("Falling back to direct ESPN API scores fetching:", error);
    
    const today = new Date();
    const past = new Date(today);
    past.setDate(today.getDate() - 14); // get up to two weeks past
    const future = new Date(today);
    future.setDate(today.getDate() + 7); // get upcoming week

    const fd = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
    const dates = `${fd(past)}-${fd(future)}`;

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

    return allEvents;
  }
};

export const fetchEspnSummary = async (league: string, event: string) => {
  try {
    const response = await fetch(`/api/summary?league=${league}&event=${event}`);
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    }
    throw new Error("Local summary API failed or returned non-JSON");
  } catch (error) {
    console.warn("Falling back to direct ESPN API summary fetching:", error);
    try {
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${event}`);
      if (!response.ok) throw new Error("Failed to fetch from ESPN directly");
      return await response.json();
    } catch (e) {
      console.error("Direct fetch failed too:", e);
      return {};
    }
  }
};
