
import p5 from 'p5';
import * as utils from '../../utils';

const pieceName = "Genuary day 14: Something you'd never make";

let d;
const allColors = [
  '#6f2dbd','#ff3d5a','#ff5715','#3a86ff','#30c2ec', '#DCF763'
]
let fadedColors;

function showMessage() {
  const area = document.getElementById('js-message')
  area.append("psssst, try clicking and dragging (spacebar to reset)");
}



function setup() {  
  utils.standardCanvas();
  showMessage();
  reset();
  frameRate(24);
  // noLoop();
}

const gridFactor = 12;
class Display {
  constructor() {
    this.pointsToDraw = [];
    this.dotsPerFrame = 5;
    this.currentColor = random(fadedColors);
  }

  drawLine() {
    const startY = random(height);
    const magnitude = random(height/10, height/3);

    let c = random(fadedColors);
    let r = random(gridFactor/2, gridFactor * 1.2);

    for (let x = 0; x < width; x += gridFactor) {
      let newY = noise(x / 400, startY);
      newY = map(newY, 0, 1, -magnitude, magnitude);
      this.pointsToDraw.push({x: x, y: newY + startY, t: frameCount, c: c, fromClick: false, r: r, decayRate: 1/300});
    }
  }

  getNewColor() {
    this.currentColor = random(fadedColors);    
  }

  logClick(x, y) {
    this.pointsToDraw.push({x, y, 
      t: frameCount, 
      c: this.currentColor, 
      fromClick: true, 
      r: gridFactor, 
      decayRate: 1/1000
    });
  }

  paint() {  
    this.pointsToDraw = this.pointsToDraw.filter((p) => {
      let frameAge = frameCount - p.t;
      return random() > (frameAge * p.decayRate);
    });

    if(this.pointsToDraw.length < 50) {
      this.drawLine();
    }

    this.pointsToDraw.forEach((p) => {
      let frameAge = frameCount - p.t;
      fill(p.c);

      if(p.fromClick) {
        p.y -= utils.relSize(2);
      };

      for (let index = 0; index < this.dotsPerFrame; index++) {
        ellipse(
          p.x,
          addVariation(p.y, frameAge, index),
          p.r
        );
      }
    });

  }
}

function addVariation(n, frameAge, index, direction) {
  let v = (index + 0.5) * frameAge * 4;
  let d = map(noise(n+index, frameAge), 0, 1, -v, v);

  return n + utils.relSize(d);
}

let bgColor = utils.penColor;

function reset() {
  console.log("resetting");
  fadedColors = allColors.map((c) => {
    let col = color(c);
    col.setAlpha(30);
    return col;
  })
  bgColor = color(bgColor);
  bgColor.setAlpha(6);

  d = new Display();
  d.drawLine();
  d.drawLine();
  d.drawLine();

  blendMode(BLEND);
  background(utils.penColor);
  noStroke();
}

let mouseDown = false;

function draw() {
  blendMode(MULTIPLY);
  background(bgColor);
  blendMode(SCREEN);

  if(mouseDown) {
    d.logClick(mouseX, mouseY);
  }

  d.paint();
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
  d.getNewColor();
}

utils.attach({
  setup,
  draw,
  mousePressed,
  mouseReleased,
  keyPressed: utils.standardKeyPressedFactory(pieceName, {32: reset, 78: draw})
});  
  