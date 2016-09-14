var express = require('express');
var fileExists = require('file-exists');
var path = require('path');

var port = process.env.PORT || 3000;
var app = express();

console.log('Checking for keys in a .env file...');
if (fileExists('./.env')) {
  console.log('Found the keys locally.');
  var keys = require('./.env');
} else {
  console.log('Checking for keys in a user-provided service...');
  console.log('If error here, there is no way to retrieve api keys.');
  keys = JSON.parse(process.env.VCAP_SERVICES)['user-provided'][0].credentials;
};

var request = require('request');

app.get('/api/github/*', (req, res) => {
  var query = req.originalUrl.replace('/api/github/','');
  request({
      url: `https://api.github.com/users/seejamescode/repos?access_token=${keys.github}`,
      headers: {
        'user-agent': 'node.js'
      }
    }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      res.send(body);
    }
  });
})

app.use('/dist', express.static('dist'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('App is live at http://localhost:' + port);
});