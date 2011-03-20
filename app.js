var querystring = require('querystring');
var express = require('express');
var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/files'));
  app.use(express.bodyParser());
});
app.register('.haml', require('hamljs'));
app.set('view engine', 'haml');
app.set('view options', {
  layout:false
});

var vids = [];

app.get('/nodeplayer', function(req, res) {
  res.render('index');
});

app.get('/addvids', function(req, res) {
  res.render('addvids');
});

app.get('/nextvideo', function(req, res) {
  res.send(vids.length ? vids.shift() : '');
});

app.get('/listvids', function(req, res) {
  var str = '';
  for (var i = 0; i < vids.length; ++i) {
    str += vids[i] + '<br/>';
  }
  res.send(str);
});

app.post('/addvid', function(req, res) {
  var id = req.body.vidid;
  if (id) {
    var qs = id.substr(id.lastIndexOf('?')+1);
    var query = querystring.parse(qs);
    if (query.v) {
      vids.push(query.v);
    }
  }
  res.redirect('/addvids');
});

app.listen(9000);
