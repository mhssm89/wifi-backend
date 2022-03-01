var fs = require('fs');
var child_process = require('child_process');

function processWifiLineForLinux(cell, line) {
    var key;
    var val;
  
    line = line.trim();
    if (line.length > 0) {
      switch (true) {
  
        case stringStartsWith(line, NET_ADDRESS_PREFIX):
        line = line.split(':');
        line.splice(0, 1);
        //INVARIANT: Address in the format Address: DC:0B:1A:47:BA:07
        if (line.length > 0) {
          cell[NET_ADDRESS_PREFIX] = line.join(":");
        }
        break;
      case stringStartsWith(line, NET_QUALITY_PREFIX):
        //INVARIANT: this line must have a similar format: Quality=41/70  Signal level=-69 dBm
        line = line.split(NET_SIGNAL_PREFIX);
        cell[NET_QUALITY_PREFIX] = line[0].split("=")[1].trim();
        if (line.length > 1) {
          cell[NET_SIGNAL_PREFIX] = line[1].split("=")[1].trim();
        }
        break;
      case stringStartsWith(line, NET_EXTRA_PREFIX):
        //INVARIANT: this line must have a similar format: Extra: Last beacon: 1020ms ago
        line = line.split(":");
        //we can ignore the prefix of the string
        if (line.length > 2) {
          cell[line[1].trim()] = line[2].trim();
        }
        break;
      default:
        //INVARIANT: the field must be formatted as "key : value"
        line = line.split(":");
        if (line.length > 1) {
          //Just stores the key-value association, so that coupling with client is reduced to the min:
          //values will be examined only on the client side
          cell[line[0].trim()] = line[1].trim();
        }
      }
    }
  
    return cell;
  }

  function processWifiStdoutForLinux(stdout) {
    var networks = {};
    var net_cell = "";
    var cell = {};
  
    stdout.split('\n').map(trimParam).forEach(function (line) {
      if (line.length > 0) {
        //check if the line starts a new cell
        if (stringStartsWith(line, NET_CELL_PREFIX)) {
          if (net_cell.length > 0) {
            networks[net_cell] = mapWifiKeysForLinux(cell);
          }
          cell = {};
          line = line.split("-");
          net_cell = line[0].trim();
          line = line[1];
        }
        //Either way, now we are sure we have a non empty line with (at least one) key-value pair
        //       and that cell has been properly initialized
        processWifiLineForLinux(cell, line);
      }
  
    });
    if (net_cell.length > 0) {
      networks[net_cell] = mapWifiKeysForLinux(cell);
    }
    return networks;
  }

  var command = 'iwlist wlan0 scanning | egrep "Cell |Address|Channel|Frequency|Encryption|Quality|Signal level|Last beacon|Mode|Group Cipher|Pairwise Ciphers|Authentication Suites|ESSID"'
function getWifiStatus(response, onSuccess, onError) {

  child_process.exec(command, function execWifiCommand(err, stdout, stderr) {
    var wifi;

    if (err) {
      console.log('child_process failed with error code: ' + err.code);
      onError(response, WIFI_ERROR_MESSAGE);
    } else {

      try {
        wifi = processWifiStdoutForLinux(stdout);
        onSuccess(response, JSON.stringify(wifi));
      } catch (e) {
        console.log(e);
        onError(response, WIFI_ERROR_MESSAGE);
      }
    }
  });
}


const test = getWifiStatus()
console.log(test);