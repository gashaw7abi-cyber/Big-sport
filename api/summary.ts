export default async function handler(req: any, res: any) {
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
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
}
