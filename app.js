var querystring = require('querystring');
var express = require('express');
var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/files'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
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
  res.render('addvids', {vids:vids, userid:req.cookies.userid});
});

app.get('/nextvideo', function(req, res) {
  res.send(vids.length ? vids.shift().v : '');
});

app.post('/addvid', function(req, res) {
  var userid = req.body.userid;
  if (userid) {
    res.cookie('userid', userid, {maxAge:1000*60*24*30, path:'/'});
  } else {
    userid = req.cookies.userid;
  }
  var id = req.body.vidid;
  if (id) {
    var qs = id.substr(id.lastIndexOf('?')+1);
    var query = querystring.parse(qs);
    if (query.v) {
      vids.push({v:query.v,u:userid});
    }
  }
  res.redirect('/addvids');
});

app.listen(9000);
