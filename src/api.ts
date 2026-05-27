export const fetchEspnNews = async () => {
  const leagues = ['eng.1', 'esp.1', 'uefa.champions'];
  let allArticles: any[] = [];
  
  await Promise.all(leagues.map(async (league) => {
    for (let page = 1; page <= 3; page++) {
      try {
        const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/news?limit=50&page=${page}`);
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            allArticles.push(...data.articles);
          }
        }
      } catch (e) {
         // ignore error for single league
      }
    }
  }));
  
  // Deduplicate by id if needed
  const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.dataSourceIdentifier || a.headline, a])).values());
  // Sort by published descending
  uniqueArticles.sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime());
  
  return uniqueArticles;
};

export const fetchEspnScores = async () => {
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

  return allEvents;
};

export const fetchEspnSummary = async (league: string, event: string) => {
  const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${event}`);
  if (!response.ok) throw new Error("Failed to fetch summary");
  return await response.json();
};
