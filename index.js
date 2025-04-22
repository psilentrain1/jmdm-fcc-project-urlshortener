require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

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

function isValidUrl(url){
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

app.post('/api/shorturl', function(req, res){
  const url = req.body.url;
  if (isValidUrl(url)){
    links.push(url);
    const shortlink = links.indexOf(url) + 1;
    res.json({"original_url": url, "short_url": shortlink})
  } else {
    res.json({"error": "invalid url"});
  }
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
