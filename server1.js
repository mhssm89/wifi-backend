// Require express and create an instance of it
var express = require("express");
const { json } = require("body-parser");
const Wifi = require("./child2");
const bodyParser = require("body-parser");


var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json())


app.get("/scan", (req, res) => {
  var networks
  const { exec } = require('child_process');
  exec('python /home/pi/Desktop/wifi-backend/scan.py',async (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log('error in command')
    return;
  }
  // the *entire* stdout and stderr (buffered)
  console.log(await stdout)
  res.send(await stdout)

});
});


// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 9000 !
app.listen(9000, function () {
  console.log(" app listening on port 9000.");
});
