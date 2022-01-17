
import p5 from 'p5';
import * as utils from '../utils';
import rectanglePack from '../utils/rectanglePack';

const pieceName = "Genuary day 17: Three colors";

let white = utils.paperColor;
let red = '#F05454';
let blue = '#30475E';
let pink = '#FF9179'


const allColors = [
  '#A37BA7','#D29FC3','#69885A','#5C5478','#ADA7C7','#B87748',
  '#CB9051','#A7132B','#803A6B','#E24874','#FFA4BE','#FFC0CD',
  '#056517','#fdd755','#eccc9e','#ff8b00',
  '#87071f','#94a8c6','#11416d','#ce9124','#ffbf57',
  '#bddded','#594937','#455c71','#6a859e','#2696b6',
  '#30c2ec','#5F6648','#71935C','#CCD9B1','#1E1108'
]

let colors = [];
function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

let areas;
let skewMagnitude, noiseDivisor;

function reset() {
  areas = [];

  utils.shuffleArray(allColors);
  
  colors = allColors.slice(0, 3);

  skewMagnitude = utils.relSize(random(10, 20));
  noiseDivisor = random(50, 100);

  // red = color(red);
  // pink = color(pink);
  // blue = color(blue);
  // blue.setAlpha(100); 
}

class CitySquare {
  constructor({x, y, w, h}) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = w + x;
    this.y2 = y + h;

    this.color = (random() > 0.1 ? colors[0] : colors[1]);
    this.color = (random() > 0.03 ? this.color : colors[2]);

    this.skewMagnitude = skewMagnitude;

    this.buildCorners();
    this.draw();
  }

  buildCorner(x0, y0, xPolarity, yPolarity) {
    return {
      x0: x0,
      y0: y0,
      x: x0 + this.propMutation(x0, xPolarity),
      y: y0 + this.propMutation(y0, yPolarity)
    };
  }

  buildCorners() {
    this.corners = [];

    this.corners.push(this.buildCorner(
      this.x1, this.y1, 1, 1
    ));
    this.corners.push(this.buildCorner(
      this.x2, this.y1, -1, 1
    ));
    this.corners.push(this.buildCorner(
      this.x2, this.y2, -1, -1
    ));
    this.corners.push(this.buildCorner(
      this.x1, this.y2, 1, -1
    ));

  }

  propMutation(p, polarity) {
    const streetMin = utils.relSize(4);
    const streetMax = utils.relSize(10);
    if(p == 0) {
      return 0;
    }
    if(p >= (height-5)) {
      return 0;
    }

    let change = polarity * map(
      noise(p / 10), 0, 1, streetMin, streetMax
    );

    return change;
  }

  drawCorner(corner) {
    const x = corner.x0;
    const y = corner.y0;

    let offsetX = map(
      noise(x/noiseDivisor, y/noiseDivisor, 5), 0, 1, -this.skewMagnitude, this.skewMagnitude
    );
    let offsetY = map(
      noise(x/noiseDivisor, y/noiseDivisor, 100), 0, 1, -this.skewMagnitude, this.skewMagnitude
    );
    if(x == 0 || x >= width-5) {
      offsetX = 0;
    }
    if(y == 0 || y >= height-5) {
      offsetY = 0;
    }
    vertex(corner.x + offsetX, corner.y + offsetY);
  }

  draw() {
    fill(this.color);
    beginShape();

    this.corners.forEach((c) => {
      this.drawCorner(c);
    })

    endShape(CLOSE);
  }
}







function draw() {
  background(white);
  const square = {x: 0, y:0, w:width, h:height}
  utils.zoomOut(0.8);

  areas = rectanglePack([square], utils.relSize(60), {smallestPossible: true});
  noStroke();
  areas.forEach((a) => {
    new CitySquare(a);
  });

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  