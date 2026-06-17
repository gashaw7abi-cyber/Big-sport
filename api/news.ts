export default async function handler(req: any, res: any) {
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
    
    const uniqueArticles = Array.from(new Map(allArticles.map((a: any) => [a.dataSourceIdentifier || a.headline, a])).values());
    uniqueArticles.sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(uniqueArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
