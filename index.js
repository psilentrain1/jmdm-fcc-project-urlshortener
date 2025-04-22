require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.use(bodyParser.urlencoded({extended: false}))

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const links = [];

function getHostname(url){
  try {
    const data = new URL(url);
    return data.hostname;
  } catch (err) {
    return null;
  }
}

app.post('/api/shorturl', function(req, res){
  const url = req.body.url;
  dns.lookup(getHostname(url), (err, address, family) => {
    if (err) {
      res.json({error: 'invalid url'});
    } else {
      links.push(url);
      const shortlink = links.indexOf(url) + 1;
      res.json({original_url: url, short_url: shortlink})
    }
  })
})

app.get('/api/shorturl/:shortlink', function(req, res){
  const url = links[req.params.shortlink - 1];
  if (url){
    res.redirect(url);
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
