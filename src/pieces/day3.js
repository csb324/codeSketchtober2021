import p5 from 'p5';
import * as utils from '../utils';
import Rock from '../utils/Rock';

const penColor = '#111111';
const paperColor = '#efefef';
let fillColor;
let gradients;
let strokeColor;

const rockColors = [
  'rgba(141, 140, 147,  0.2)',
  'rgba(170, 176, 178,  0.2)',
  'rgba(98, 104, 135, 0.2)',
  'rgba(157, 155, 180, 0.2)',
  'rgba(178, 137, 97,  0.2)',
  'rgba(187, 185, 177,  0.2)',
  'rgba(190, 171, 155,  0.2)'
]


class ArchaeologyRock extends Rock {
  setColor() {
    drawingContext.fillStyle = random(gradients);  
  }
}

function setup() {  
  utils.standardCanvas();
  fillColor = color(paperColor);
  fillColor.setAlpha(40);
  reset();
  noLoop();
}

function reset() {
  clear();
  fill(fillColor);
  blendMode(ADD);

  strokeColor = color(paperColor);
  generateGradients();
}

function generateGradients() {
  gradients = [];
  for (let i = 0; i < 20; i++) {
    let xChange = random();
    let yChange = random();    
    if(xChange < 0.2) {
      yChange = random(0.6, 1)
    };
    if(yChange < 0.2) {
      xChange = random(0.6, 1);
    }
    let color1 = random(rockColors);
    let color2 = random(rockColors);
    if (color1 === color2) {
      color2 = 'rgba(10, 10, 10, 0.2)';
    }
    gradients.push(
      utils.createGradient(
        color1, 
        color2, 
        xChange, 
        yChange
      )
    )
  }
}


function rectanglePack(subsegments, i) {
  const minDimension = utils.relSize(30);
  let newSubsegments = [];
  for (let index = 0; index < subsegments.length; index++) {
    const element = subsegments[index];

    const wideEnoughToSplit = (element.w > 2*minDimension);
    const tallEnoughToSplit = (element.h > 2*minDimension);

    if (random() < (i/10) || !(wideEnoughToSplit || tallEnoughToSplit)) {
      newSubsegments.push(element);
    } else if (wideEnoughToSplit || tallEnoughToSplit) {      
      if(element.w > element.h) {
        const divisionPoint = random(minDimension, element.w - minDimension);
        const newPoint = {
          x: element.x + divisionPoint, 
          y: element.y, 
          w: element.w - divisionPoint, 
          h: element.h
        }
        newSubsegments.push(newPoint);
        element.w = divisionPoint;
        newSubsegments.push(element);

      } else {
        const divisionPoint = random(minDimension, element.h - minDimension);
        const newPoint = {
          x: element.x, 
          y: element.y  + divisionPoint, 
          w: element.w, 
          h: element.h - divisionPoint
        }
        newSubsegments.push(newPoint);
        element.h = divisionPoint;
        newSubsegments.push(element);

      }  
    }


  }
  return newSubsegments;
}

function draw() {
  background(penColor);
  let subsegments = [{
    x: 0, y: 0, w: width, h: height
  }];
  let oldSubsegments = [];
  let i = 0;
  while(oldSubsegments.length !== subsegments.length) {
    oldSubsegments = subsegments;
    subsegments = rectanglePack(subsegments, i);
    i++;
  }
  // subsegments = rectanglePack(subsegments, true);
  // subsegments = rectanglePack(subsegments);
  // subsegments = rectanglePack(subsegments);
  // subsegments = rectanglePack(subsegments);
  // subsegments = rectanglePack(subsegments);

  const padding = utils.relSize(10);

  translate(padding/2, padding/2);

  noStroke();

  subsegments.forEach((s) => {
    const r = new ArchaeologyRock(s.x, s.y, s.w - padding, s.h - padding);
    r.draw();
  })
  
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
