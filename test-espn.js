const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news');
  console.log(res.headers.get('access-control-allow-origin'));
}

test();
