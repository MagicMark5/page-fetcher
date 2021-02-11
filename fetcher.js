/*
should take a URL as a command-line argument 
as well as a local file path 
and download the resource to the specified path.
*/

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const urlAndPath = process.argv.slice(2); // arguments from command line

fs.access(urlAndPath[1], (err) => {
  if (err) {
      console.log("Downloading file..."); // if it doesn't already exist
      requestURL();
  } else {
    console.log(`A file at ${urlAndPath[1]} already exists.`);
    rl.question(`Do you wish to overwrite this file? \n(Type Y then Enter to overwrite, return any other key to quit) `, (answer) => { // callback for question is called when ENTER is pressed (because its 'readline')
      if (answer === "Y") {
        console.log("if you say so...");
        requestURL();
        rl.close();
      } else {
        process.exit();
      } 
    });
  }
});

const requestURL = function() {

  request(urlAndPath[0], (error, response, body) => {
  
    if (error) throw error;
  
    fs.writeFile(urlAndPath[1], body, (err) => { // body.length is the number of bytes contained in the body
      if (err) throw err;
      console.log("Downloaded and saved " + body.length + " bytes to " + urlAndPath[1]);
    });
  
  });
};
