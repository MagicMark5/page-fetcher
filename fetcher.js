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

const checkFile = function() {
  fs.access(urlAndPath[1], (err) => { // first try to access the file without reading to see if it exists (err) === file does not exist
    if (err) {
      // console.log(err);
      requestURL();  // if it doesn't already exist
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
};

const requestURL = function() {

  request(urlAndPath[0], (error, response, body) => {
    if (error) throw error; // this error would throw if URI given was invalid

    if (response.statusCode === 200) {
      console.log("Downloading file...");
      fs.writeFile(urlAndPath[1], body, (err) => { // body.length is the number of bytes contained in the body
        if (err) throw err;
        console.log("Downloaded and saved " + body.length + " bytes to " + urlAndPath[1]);
        process.exit();
      });
    } else {
      handleError(response.statusCode); // separate handler for potential errors and kills program
    }
  
  });
};

const handleError = function(statusCode) {
  if (statusCode === 404) {
    console.log(`Error ${statusCode}: Resource was not found.`);
  } else if (statusCode === 500) {
    console.log(`Error ${statusCode}: The server had an error.`);
  } else {
    console.log("File write not performed due to status code: " + statusCode);
  }
  process.exit();
};

if (urlAndPath[1].slice(0,2) !== './') {
  console.log("Invalid local file path. It must begin with './'"); // ensures files are only written to the same folder as the current working directory
  process.exit();
} else {
  checkFile(); // if ./ was put in front of the local file path
}
