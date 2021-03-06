const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// const dotenv = require('dotenv').config();

function fetchPathsFromSomeExternalSource() {
  const files = fs.readdirSync(`${__dirname}/src/pieces`);
  let entries = {};
  files.forEach((f) => {
     entries[f] = { 
       import: `./src/pieces/${f}`,
       filename: `/pieces/${f}`
     }
  })  
  return entries;
}

module.exports = {
  entry() {
    return fetchPathsFromSomeExternalSource(); // returns a promise that will be resolved with something like ['src/main-layout.js', 'src/admin-layout.js']
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js" // string (default)
  },
  plugins: [
    new webpack.DefinePlugin( {
      "process.env.KEYS": JSON.stringify({
        WORDNIK_API_KEY: process.env.WORDNIK_API_KEY
      })
    } ),
  ],
};