var mysql = require('mysql');
var express = require('express');
var multer = require('multer'); 
var bodyParser = require("body-parser");
var app = express();
app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));
app.use(bodyParser.json()); // Configures bodyParser to accept JSON
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

//mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "forum"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the mysql database.");
});

var form=`
<form enctype="multipart/form-data" id="post-form">
	<input type="text" name="parent" id="parent-input" readonly="readonly" value="0"/><br>
	<textarea type="text" name="message" id="message-input" rows="4" cols="50" maxlength="2000"></textarea><br>
	<input type="submit" name="submit"/>
</form>`

function post(id, parent, message){
	return `<div><b>${id}</b> <a href=#${parent}>${parent}</a></br><p>${message}</p></div>`
}

app.get(["/", /[0-9]+$/], function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/posts.json', function (req, res) {
	if(con.state="authenticated"){
		con.query("SELECT * FROM posts", function (err, result, fields) {
		    if (err) throw err
		    res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify(result));
		});
	}
})

app.get(/[0-9]+\/post\.json/, function (req, res) {
	if(con.state="authenticated"){
		threadId=/([0-9]+)\/post\.json/.exec(req.url)[1];

		con.query("SELECT * FROM posts WHERE id=?", [threadId, threadId], function (err, result, fields) {
		    if (err) throw err
		    res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify(result));
		});
	}
})

app.get(/[0-9]+\/replies\.json/, function (req, res) {
	if(con.state="authenticated"){
		threadId=/([0-9]+)\/replies\.json/.exec(req.url)[1];

		con.query("SELECT * FROM posts WHERE parent=?", [threadId, threadId], function (err, result, fields) {
		    if (err) throw err
		    res.setHeader('Content-Type', 'application/json');
		    res.send(JSON.stringify(result));
		});
	}
})

app.post('/send', function (req, res) {
	console.log(req.body);
	let parent=req.body.parent;
	if(parent=='' || parent==null || parent==undefined){
		parent=0;
	}
	if(con.state="authenticated"){
		var sql = "INSERT INTO posts (parent, message) VALUES ?";
		con.query(sql, [[[parent, req.body.message]]], function (err, result) {
			if (err) throw err;
			console.log("Number of records inserted: " + result.affectedRows);
		});
	}
	res.redirect('/');
})

app.get('/servergenerated', function (req, res) {
	var doc="<meta charset='utf-8'></meta><h1>node.js based board</h1>"+form;
	if(con.state="authenticated"){
		con.query("SELECT * FROM posts", function (err, result, fields) {
		    if (err) throw err
		    for (var r in result){
				doc+=post(result[r].id, result[r].parent, result[r].message)
		    }
			res.set({ 'content-type': 'text/html; charset=utf-8' })
			res.end(doc)
		});
	}
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	if(host=="::"){
		host="localhost";
	}
	
	console.log("App listening at http://%s:%s", host, port)
})