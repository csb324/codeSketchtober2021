import p5 from 'p5';
import * as utils from '../utils';

import Building from '../utils/Building';

let buildings = [];

function setup() {  
  utils.standardCanvas();
  reset();
  frameRate(12);
}

function reset() {
  background(utils.paperColor);

  createBuildings();
}

let d;
function createBuildings() {
  buildings = [];

  let x = 0;
  while(x < width) {
    const b = new Building(x);
    buildings.push(b);
    x += b.width;
    x += utils.relSize(40);
  }

  x -= utils.relSize(40);

  d = x - width;
}
function draw() {
  utils.zoomOut(0.7);
  translate(-d/2, 0);

  background(utils.paperColor);
  strokeWeight(utils.relSize(1));
  fill(utils.paperColor);
  stroke(utils.penColor);
  // strokeWeight(utils.relSize(3));

  buildings.forEach((b) => {
    b.addProgress();
    b.drawBuilding();
  });
  buildings.forEach((b) => {
    b.drawScaffolding();
  });

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
