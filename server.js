var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var json2csv = require('json2csv').Parser;
var Json2CsvParser = new json2csv({header: true});
var fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var staticPath = path.join(__dirname, '/app');
var defaultDownloadPath = path.join(staticPath,'/cache');
app.use(express.static(staticPath));
//createCSVfile("t.txt", "abcd", undefined);
app.listen(8080, function() {
  console.log('listening on port 8080');
});

app.post('/convert-csv', function(req, res){
	console.log("converting to csv file");
	console.log(req.body.csvtext);
	createCSVfile(req.body.filename,req.body.csvtext,res)
});

function createCSVfile(filename,body,res){
	//console.log(body.replace(/^"(.*)"$/,"$1"));
	body=JSON.parse(body);
	csvData=Json2CsvParser.parse(body);
	console.log(csvData);
	fs.writeFile(defaultDownloadPath+"/"+filename,csvData,function(error,resp){
			res.status(200).send();
	});
	//res.status(200).send();
}
