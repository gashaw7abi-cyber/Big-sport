const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("public/icon-google.jpg");
https.get("https://i.postimg.cc/g29Gpg7r/1778746810882.jpg", function(response) {
  response.pipe(file);
});
