var querystring = require('querystring');
var express = require('express');
var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/files'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:'whee'}));
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
  res.render('addvids', {vids:vids, userid:req.cookies.userid, err:req.flash('error')});
});

app.get('/nextvideo', function(req, res) {
  res.send(vids.length ? JSON.stringify(vids.shift()) : '');
});

app.post('/addvid', function(req, res) {
  var userid = req.body.userid;
  if (userid) {
    res.cookie('userid', userid, {maxAge:1000*60*24*30*12, path:'/'});
  } else {
    userid = req.cookies.userid;
  }
  var gotvid = false;
  var id = req.body.vidid;
  if (id) {
    var qs = id.substr(id.lastIndexOf('?')+1);
    var query = querystring.parse(qs);
    if (query.v) {
      vids.push({v:query.v,u:userid});
      gotvid = true;
    } else if (query.video_ids) {
      var v_ids = query.video_ids.split(',');
      var index = typeof query.index !== 'undefined' ? query.index : 0;
      var first = v_ids[index];
      vids.push({v:first,u:userid});
      for (var i=0;i<v_ids.length;++i) {
        if (v_ids[i] !== first) {
          vids.push({v:v_ids[i],u:userid});
        }
      }
      gotvid = true;
    }
  }
  if (!gotvid) {
    req.flash('error', 'Could not parse video id');
  }
  res.redirect('/addvids');
});

app.listen(9000);
