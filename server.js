// Require express and create an instance of it
var express = require("express");
const { json } = require("body-parser");
const Wifi = require("./child2");
var wifiscanner = require("wifiscanner");
const path = __dirname + "/views/";

var app = express();
app.use(express.static(path));
app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/scan", (req, res) => {
  var networks;
  const { exec } = require("child_process");
  exec(
    "python /home/pi/Desktop/wifi-backend/scan.py",
    async (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log("error in command");
        return;
      }
      // the *entire* stdout and stderr (buffered)
      console.log(await stdout);
      res.send(await stdout);
    }
  );
});

app.post("/connect", (req, res) => {
  console.log(req.body);
  var data = req.body;
  res.send(data);
});

app.get("/scanner", (req, res) => {
  var scanner = wifiscanner();
  scanner.scan(function (error, networks) {
    if (error) {
      console.error(error);
    } else {
      console.dir(networks);
    }
  });
  scanner.scan(function (error, networks) {
    if (error) {
      console.error(error);
    } else {
      console.dir(networks);
    }
  });
  scanner.scan(function (error, networks) {
    if (error) {
      console.error(error);
    } else {
      console.dir(networks);
      res.send(networks);
    }
  });
});

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 9000 !
app.listen(9000, function () {
  console.log("Example app listening on port 9000.");
});
