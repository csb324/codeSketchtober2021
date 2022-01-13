import p5 from 'p5';
import ml5 from 'ml5';
import * as utils from '../utils';
import pack from '../utils/rectanglePack';

// const demo = [
  //{"word":"warm,"
  //,"confidence":96,
  //"x_start":3094,
  //"y_start":443,"x_end":3190,
  //"y_end":467},{"word":"high","confidence":96,"x_start":3206,"y_start":436,"x_end":3272,"y_end":468},{"word":"62.","confidence":96,"x_start":3289,"y_start":437,"x_end":3328,"y_end":462}];

let settings = {};
let computed = {};
let classifier, neuralNetwork, data;

const maxY = 6730;
const maxX = 3300;

function preload() {
  data = loadJSON('/electionday.json');
}

let c;
function getLabel(result) {
  result.sort((a, b) => {
    if(a.confidence < b.confidence) {
      return 1;
    }
    return -1;
  });
  return result[Math.floor(random(10))];
}

let inputs = [];
let areas = [];

function setup() {  
  c = utils.standardCanvas();
  reset();
  noLoop();

  // console.log(data);
  neuralNetwork = ml5.neuralNetwork({
    task: 'classification',
    inputs: ['x_start', 'y_start', 'x_end', 'y_end'],
    outputs: ['word']
  });

  data['data'].forEach((word) => {
    neuralNetwork.addData([word.x_start, word.y_start, word.x_end, word.y_end], [word.word])
  });

  neuralNetwork.normalizeData();

  window.neuralNetwork = neuralNetwork;
  // console.log(neuralNetwork.data.data.raw)
  neuralNetwork.train(() => {

  }, () => {
    console.log("trained");

    buildInputs();
    neuralNetwork.classifyMultiple(inputs, (error, result) => {
      if(error) {
        console.error(error);
        return;
      }
      console.log(result);
      result.forEach((r, i) => {
        const l = getLabel(r);
        areas[i].name = l.label;
      })
    })
    draw();
    return inputs;
  })
}

function buildInputs() {
  inputs = [];
  const yFactor = maxY / 30;
  const xFactor = maxX / 30;

  for (let x = 0; x < 30; x++) {
    for (let y = 0; y < 30; y++) {
      let xEnd =  x*xFactor + random(50, 500);
      let yEnd = y*yFactor + random(10, 40);

      inputs.push([x*xFactor, y*yFactor, xEnd, yEnd]);

      areas.push({
        x: x*xFactor, y: y*yFactor, xEnd, yEnd
      })
    }
  }
  console.log(inputs);
  return inputs;
}

function reset() {
}

function draw() {
  background(utils.paperColor);

  areas.forEach((i) => {
    text(i.name, ((i.x / maxX) * width), (i.y / maxY) * height);
  })
  console.log(areas);
}


const pieceName = "Machine Learning (wrong answers only)";

utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});