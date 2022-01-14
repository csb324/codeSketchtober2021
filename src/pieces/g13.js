import p5 from 'p5';
import * as utils from '../utils';
import wiggleLine from '../utils/wiggleLine';

let colors = [];

function setup() {  
  const c = createCanvas(800, 80); // it's 800x80 day!
  c.parent('canvas-parent');
  reset();
}
const allColors = [
  '#A37BA7','#D29FC3','#69885A','#5C5478','#ADA7C7','#B87748',
  '#CB9051','#A7132B','#803A6B','#E24874','#FFA4BE','#FFC0CD',
  '#056517','#fffbef','#fdd755','#eccc9e','#ff8b00','#f8e4c8',
  '#87071f','#94a8c6','#11416d','#ce9124','#ffe793','#ffbf57',
  '#bb051f','#bddded','#594937','#455c71','#6a859e','#2696b6',
  '#30c2ec','#5F6648','#FBADB4','#71935C','#CCD9B1','#1E1108'
]

function reset() {

  utils.shuffleArray(allColors);
  colors = allColors.slice(0, 5);
  frameRate(4);
}

class Braid {
  constructor(colorList) {
    this.colors = colorList.map((c) => color(c));

    this.cVariation = random(10, 20);

    this.modifiedColors = this.colors.map((c) => {
      return this.modifyColor(c);
    })

    this.x = 0;
    this.numSteps = 40;    
    this.squareUnit = 20;
    this.density = random(6, 15);

    this.central = Math.floor(colors.length/2);
  }


  modifyColor(c) {
    const r = c._getRed();
    const g = c._getGreen();
    const b = c._getBlue();

    const numOptions = 10;
    let options = [];
    let v = this.cVariation;

    for (let index = 0; index < numOptions; index++) {
      if(random() < 0.02) {
        options.push(random(colors));
      } else {
        let r1 = r + random(-v, v);
        let g1 = g + random(-v, v);
        let b1 = b + random(-v, v);
        options.push([r1, g1, b1]);  
      }
    }

    return options
  }

  drawRect(x, y, width, height, colorSet, vertical = false) {
    const linesPerSq = this.density;
    const bgPad = 2;
    const delta = this.squareUnit / linesPerSq;
    fill(random(colorSet));
    rect(x+bgPad, y+bgPad, width - (2*bgPad), height - (2*bgPad));

    for (let index = 0; index < linesPerSq; index++) {
      stroke(random(colorSet));
      strokeWeight(random(2.5, 5));


      if(vertical) {
        let dx = index * delta;
        wiggleLine(x+dx, y - delta, x+dx, y+height)
      } else {
        let dy = index * delta;
        wiggleLine(x, y+dy, x+width, y+dy)
      }
    }

  }

  drawRow() {
    this.drawRect(
      this.x - this.squareUnit*6, this.x, this.squareUnit * 6, this.squareUnit,
      this.modifiedColors[0]
    );
    
    this.drawRect(
      this.x - this.squareUnit*4, this.x, this.squareUnit, this.squareUnit,
      this.modifiedColors[2],
      true
    );

    this.drawRect(
      this.x - this.squareUnit*2, this.x, this.squareUnit, this.squareUnit,
      this.modifiedColors[4],
      true
    );
  }


  draw() {
    this.x = 0;
    noFill();
    let toggle = false;
    rotate(TWO_PI * -0.125);
    translate(-40, -52);

    for (let index = 0; index < this.numSteps; index++) {
      this.x += this.squareUnit;
      this.drawRow();

      let last = this.modifiedColors.shift();
      this.modifiedColors.push(last);

      toggle = !toggle;
    }

  }
}

function draw() {
  clear();
  const b = new Braid(colors);
  b.draw();
  rotate(PI * 0.25);
  stroke(0);
  strokeWeight(10);
  fill(0);
  wiggleLine(0, 5, 450, 5, false, 3);
  wiggleLine(900, 5, 450, 5, false, 3);
  wiggleLine(0, 90, 450, 90, false, 3);
  wiggleLine(450, 90, 900, 90, false, 3);
}



utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
