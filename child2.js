


const { exec } = require("child_process");

function getWifiList(){
    exec("iwlist wlan0  scan", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    return(stdout)})}


module.exports = { getWifiList };

console.log(getWifiList())
