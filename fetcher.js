/*
should take a URL as a command-line argument 
as well as a local file path 
and download the resource to the specified path.
*/

const request = require('request');
const fs = require('fs');
const urlAndPath = process.argv.slice(2);

request(urlAndPath[0], (error, response, body) => {
  
  if (error) throw error;
  
  fs.writeFile(urlAndPath[1], body, (err) => { // body.length is the number of bytes contained in the body
    if (err) throw err;
    console.log("Downloaded and saved " + body.length + " bytes to " + urlAndPath[1]);
  });

});