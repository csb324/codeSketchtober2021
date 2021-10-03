import p5 from 'p5';
import * as utils from '../utils';

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

function setup() {  
  utils.standardCanvas();
  fillColor = color(paperColor);
  fillColor.setAlpha(40);
  reset();
  noLoop();
}

function reset() {
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


function deform(array) {
  let na = [];
  array.push(array[0]);

  for (let i = 1; i < array.length; i++) {
    const element = array[i];
    const last = array[i-1];
    na.push(last);

    const v1 = createVector(element.x, element.y);
    const v2 = createVector(last.x, last.y);

    const movement = v1.copy().sub(v2);

    movement.mult(0.5);
    movement.add(p5.Vector.random2D().setMag(movement.mag() * 0.2));

    v1.sub(movement);
    const newPoint = {x: v1.x, y: v1.y, new: true};
    na.push(newPoint);
  }

  // return array;
  // na.push(array[array.length-1]);
  return na;
}

function reduce(array) {
  const r = random(100);
  const nArray = array.filter((_e, i) => noise(i/array.length, r) > 0.5);
  if (nArray.length > 2) {
    return nArray;
  } else {
    // sometimes something weird happens with like, the number 29? 
    // anyway, this fixed it.
    // life's too short to find out what's wrong with the number 29
    noiseSeed(random(1000));
    return reduce(array);
  }
}

function deformAndDraw(a) {
  if(a.length == 0) {
    return [];
  }
  a = deform(a);
  drawShape(a);
  return a;
}

function baseRockPoints(w, h) {
  let points = [];
  for (let r = 0; r < TWO_PI; r+= random(PI * 0.5)) {
    points.push({x: cos(r) * w/2, y:sin(r) * h/2})   
  }
  return points;
}

function drawRock(x, y, w, h) {
  let points = baseRockPoints(w, h);
  let pointsD = points;

  const howManyDeforms = floor(random(2, 4));
  const howManyRidges = floor(random(1, 5));

  push();
  translate(x + (w/2), y + (h/2));
  noStroke();
  drawingContext.fillStyle = random(gradients);  

  drawShape(points);
  for (let i = 0; i < howManyDeforms; i++) {
    pointsD = deformAndDraw(pointsD);
    if(i == 0 || random() > 0.5) {
      deformAndDraw(reduce(pointsD));
      if(random() > 0.5) {
        deformAndDraw(reduce(pointsD));
      }
    }
  }
  
  for (let i = 0; i < howManyRidges; i++) {
    drawRidge(pointsD);
  }
  pop();
}

function drawRidge(pointsArray) {
  strokeColor.setAlpha(random(10, 40));
  strokeWeight(utils.relSize(random(1, 3)));
  stroke(strokeColor);
  const p1 = random(pointsArray);
  const p2 = random(pointsArray);  
  line(p1.x, p1.y, p2.x, p2.y);
}

function drawShape(pointsArray) {
  if(random() > 0.7) {
    drawingContext.fillStyle = random(gradients);  
  }

  beginShape()
  for (let index = 0; index < pointsArray.length; index++) {
    const p = pointsArray[index];
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}


function rectanglePack(subsegments, force = false) {
  const minDimension = utils.relSize(100);
  let newSubsegments = [];
  for (let index = 0; index < subsegments.length; index++) {
    const element = subsegments[index];

    const wideEnoughToSplit = (element.w > 2*minDimension);
    const tallEnoughToSplit = (element.h > 2*minDimension);

    if(force || wideEnoughToSplit || tallEnoughToSplit) {
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
    } else {
      console.log("was it wide enough?");
      console.log(wideEnoughToSplit);
      console.log("was it tall enough?");
      console.log(tallEnoughToSplit);
      
      newSubsegments.push(element);
    }

  }
  return newSubsegments;
}

function draw() {
  background(penColor);
  let subsegments = [{
    x: 0, y: 0, w: width, h: height
  }];
  subsegments = rectanglePack(subsegments, true);
  subsegments = rectanglePack(subsegments);
  subsegments = rectanglePack(subsegments);

  const padding = utils.relSize(50);

  translate(padding/2, padding/2);

  noStroke();

  subsegments.forEach((s) => {
    drawRock(s.x, s.y, s.w - padding, s.h - padding);
  })
  
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
