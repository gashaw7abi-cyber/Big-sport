async function test() {
  const res = await fetch('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard');
  console.log("Scores CORS Header:", res.headers.get('access-control-allow-origin'));
}
test();
