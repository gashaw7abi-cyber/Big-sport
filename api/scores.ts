export default async function handler(req: any, res: any) {
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

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(allEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
}
