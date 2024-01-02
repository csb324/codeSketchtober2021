import p5 from 'p5';
import rectanglePack from '../../utils/rectanglePack';
import * as utils from '../../utils';
import { Clothing, ButtonDown, Dress, Pants, Shoes, TShirt, Underpants, Shorts, Necklace } from '../../utils/Clothing';

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

function reset() {
  fill(random(55) + 100);
}

let lastPoints = [];
function mouseReleased() {
  push();
  if(lastPoints.length > 0) {
    let lp = lastPoints[lastPoints.length - 1];
    line(lp.x, lp.y, mouseX, mouseY);
  }
  lastPoints.push({x: mouseX, y: mouseY});

  strokeWeight(utils.relSize(10));
  point(mouseX, mouseY);

  console.log(lastPoints.map((v) => {
    return {
      x: Math.round(v.x/width * 100) /  100,
      y: Math.round(v.y / height * 200) / 100
    }
  }));
  pop();
}

function drawClothing({x, y, w, h}) {
  push();
  translate(x, y);

  let ratio = w/h;
  let double = {
    x: false,
    y: false
  };

  if(ratio > 3) {
    double.x = true;
    w = w/2;    
  }

  if (ratio < 0.28) {
    double.y = true;
    h = h/2;
  }
  
  ratio = w/h;
  let article;

  if(ratio > 0.85 && ratio < 1.15) {
    if(w > utils.relSize(120)) {
      article = new TShirt(w, h, double)    
    } else {
      article = new Shoes(w, h, double);
    }
  } else if ((1/ratio) > 2.1) {
    if(h > utils.relSize(250)) {
      article = new Pants(w, h, double);
    } else {
      article = new Necklace(w, h, double);
    }

  } else if ((1/ratio) > 1.5) {
    article = new Dress(w, h, double);
  } else if (ratio > 1.5) {
    article = new ButtonDown(w, h, double);
  } else if (ratio > 1.15) {
    if(random() < 0.2) {
      article = new Underpants(w, h, double);
    } else {
      article = new Shorts(w, h, double);
    }
  } else {
    // stroke('green');
    article = new Clothing(w, h, double);
  }

  if(article) {
    article.draw();

  }

  pop();
}

function draw_fake() {
  background(utils.paperColor);
  stroke(utils.penColor);

  
}

function draw() {
  background(utils.paperColor);
  stroke(utils.penColor);
  noFill();
  strokeWeight(utils.relSize(2));

  const suitcase = {x: 0, y:0, w:width, h:height}
  utils.zoomOut(0.8);
  rect(0, 0, width, height);
  utils.zoomOut(0.9);


  let clothingAreas = rectanglePack([suitcase], utils.relSize(100));

  clothingAreas.forEach((a) => {
    drawClothing(a);
  })
  
  // fill(0);
  // textAlign(CENTER, CENTER);
  // textSize(20);
  // text("coming soon", width/2, height/2);
}

const pieceName = "Packing";

utils.attach({
  setup,
  // mouseReleased,
  // draw: draw_fake,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});