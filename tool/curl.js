var http = require("http");
const https = require('https');
// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  console.log(url);
  https.get(url, function(res) {
    console.log(res);
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on("end", function() {
        callback(data);
      });
    }).on("error", function(error) {
      console.log(error);
      callback(null);
    });
  }
  
  exports.download = download;