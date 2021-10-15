// delicious

import p5 from 'p5';
import * as utils from '../utils';
import LifeSaver from '../utils/LifeSaver';

let gridSize;
let gridUnit;
let candies = [];

function setup() {  
  utils.standardCanvas();
  // noLoop();
  frameRate(1);
  reset();
}

function reset() {

  clear();

  gridSize = floor(random(3, 6));
  gridUnit = width / gridSize;
  createGradients();

  createCandies();
}

let gradients = []

function createGradients() {
  gradients = [];
  let red = [
    'rgba(211, 3, 4, 1.00)',
    'rgba(254, 106, 113, 1.00)',
    'rgba(246, 3, 1, 1.00)',
    'rgba(254, 106, 113, 1.00)',
    'rgba(246, 3, 1, 1.00)',
    'rgba(206, 27, 18, 1.00)'
  ];

  let orange = [
    'rgba(253, 101, 41, 1.00)',
    'rgba(255, 133, 73, 1.00)',
    'rgba(250, 104, 21, 1.00)',
    'rgba(255, 155, 101, 1.00)',
    'rgba(253, 101, 41, 1.00)',
    'rgba(252, 67, 2, 1.00)'
  ];

  let green = [
    'rgba(0, 128, 33, 1.00)',
    'rgba(5, 165, 68, 1.00)',
    'rgba(115, 219, 147, 1.00)',
    'rgba(4, 153, 58, 1.00)',
    'rgba(5, 165, 68, 1.00)',
    'rgba(0, 128, 33, 1.00)',
    'rgba(163, 247, 185, 1.00)',
    'rgba(0, 97, 19, 1.00)',
  ];

  let yellow = [
    'rgba(250, 181, 61, 1.00)',
    'rgba(246, 186, 55, 1.00)',
    'rgba(247, 212, 130, 1.00)',
    'rgba(250, 201, 97, 1.00)',
    'rgba(248, 222, 158, 1.00)',
    'rgba(254, 221, 155, 1.00)',
    'rgba(248, 203, 132, 1.00)',
    'rgba(250, 181, 61, 1.00)',
    'rgba(254, 221, 155, 1.00)',
    'rgba(250, 201, 97, 1.00)'
  ]
  
  const purple = [
    'rgba(61, 27, 26, 1.00)',
    'rgba(164, 114, 125, 1.00)',
    'rgba(96, 30, 42, 1.00)',
    'rgba(156, 76, 82, 1.00)',
    'rgba(149, 76, 96, 1.00)',
    'rgba(96, 30, 42, 1.00)',
    'rgba(61, 27, 26, 1.00)',

  ]

  let colors = [red, orange, green, yellow, purple];

  colors.forEach((c) => {

    gradients.push(
      utils.createRadialGradient(
        c, gridUnit, 0, -gridUnit/4
      )
    )

  })
}

function createCandies() {
  candies = [];
  for (let x = 0; x < width; x+= gridUnit) {
    for (let y = 0; y < width; y+= gridUnit) {
      const c = random(gradients);
      const l = new LifeSaver(x + (gridUnit/2), y + (gridUnit/2), gridUnit * 0.9, gridUnit * 0.9, c);
      candies.push(l);
    }
  }
}

function updateCandies() {
  const toReplace = floor(random(candies.length));
  const old = candies[toReplace];
  const c = random(gradients);
  candies[toReplace] = new LifeSaver(old.x, old.y, old.w, old.h, c);
}

function draw() {
  background(utils.paperColor);
  // fill(utils.paperColor);
  // stroke(utils.penColor);
  utils.zoomOut(0.8);

  updateCandies();
  candies.forEach((c) => c.draw());

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
