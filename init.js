var fs = require('fs');
var path = require('path');
// var copyfiles = require('copyfiles');
const process = require( 'process' );

const piecesWithFilenames = require('./prompts.js');

function init() {
  const fileName = process.argv[2];
  if (!fileName) { return; }
  const prompt = piecesWithFilenames[fileName];

  if (!prompt) {
    console.log(fileName);
    console.log("prompt not found");
    return;
  }

  const scriptLocation = `./src/pieces/${fileName}.js`

  if(fs.existsSync(scriptLocation)) {
    console.log("File already exists");
    return;
  }

  console.log(prompt);
  console.log("gonna create a file....");

  const content = `
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "${prompt.name}";

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

function reset() {
  fill(random(55) + 100);    
}

function draw() {
  rect(0, 0, width, height);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("coming soon", width/2, height/2);
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  `

  fs.writeFile(scriptLocation, content, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log("File created!");
  });

}

init();