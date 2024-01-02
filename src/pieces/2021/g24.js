import p5 from 'p5';
import * as utils from '../../utils';
import { drawHex, drawTriangle } from '../../utils/polygons';

const pieceName = "Pseudo-random number generator";

let r, dice, settings, font, hexDiameter, triangleDiameter;

class PseudoRandom {
  constructor(s) {
    this.seed = s || parseInt(Date.now());
  }
  get() {
    this.seed += 1;
    let m = this.seed * Math.SQRT2;
    m *= sin((this.seed) / 10000);
    m *= fract(this.seed / 365);
    return fract(m);
  }
}

function preload() {
  font = loadFont('/fonts/cafe.ttf');
}

const strokeSize = 15;
function getColorsFromValue(value) {

  const colorPairs = [
    {
      colors: ['#272932','#3b4954', '#DDFC74'], // nat 1
    },
    {
      colors: ['#f8bd7f','#facfad',utils.penColor],
    },
    {
      colors: ['#514b23','#4F5D2F', utils.paperColor],
    },
    {
      colors: ['#1A535C','#4ECDC4', utils.paperColor],
    },
    {
      colors: ['#5f021f','#990033', utils.paperColor],
    },
    {
      colors: ['#322A26', '#454B66', utils.paperColor],
    },
    {
      colors: ['#F4B393','#F8F32B', utils.penColor],
    },
    {
      colors: ['#01172F', '#00635D', utils.paperColor],
    },
    {
      colors: ['#84A9C0', '#B3CBB9', utils.penColor],
    },
    {
      colors: ['#DC6BAD', '#EFABFF', utils.penColor], // 10
    },
    {
      colors: ['#7BC950', '#9CFFD9', utils.penColor],
    },
    {
      colors: ['#2A46B7', '#3454D1', utils.paperColor],
    },
    {
      colors: ['#972D07', '#FF4B3E', utils.paperColor],
    },
    {
      colors: ['#360568','#5B2A86', utils.paperColor],
    },
    {
      colors: ['#EF6F6C','#56E39F', utils.paperColor], // 15
      forceLinear: true
    },
    {
      colors: ['#3772FF', '#DF2935', utils.paperColor],
      forceLinear: true
    },
    {
      colors: ['#CCA43B', '#363636', utils.paperColor]
    },
    {
      colors: ['#FF9F1C', '#FFBF69', utils.penColor]
    },
    {
      colors: ['#8A817C', '#BCB8B1', utils.penColor]
    },
    {
      colors: ['#c2b9ca','#dfdfe2', '#F25C54']
    }
  ];
  const gradientSize = settings.objectSize / 2;

  let c = colorPairs[value - 1] ||  colorPairs[0];
  let pair = c.colors;

  let g;
  if(random() > 0.5 || c.forceLinear) {
    g = drawingContext.createLinearGradient(
      -gradientSize, 0, gradientSize, 0
    );  
    g.addColorStop(0, pair[0]);
    g.addColorStop(1, pair[1]);
  } else {
    g = drawingContext.createRadialGradient(0, 0, 0, 0, 0, settings.objectSize * 0.9);
    g.addColorStop(1, pair[0]);
    g.addColorStop(0, pair[1]);

  }

  return {
    gradient: g,
    text: pair[2]
  };

}

const highlightColor = '#969690';
const shadowColorLight = '#6e6f73';
const shadowColorSubtle = '#71737a';
const shadowColorDarker = '#636469';
const shadowColorDark = '#5a5b61';

const triangleMap = [
  { // center
    corners: [7, 8, 9],
    value: 1,
    color: highlightColor
  },
  {
    corners: [0, 1, 7],
    value: 0,
    color: shadowColorDarker
  },
  {
    corners: [0, 5, 7],
    value: 0,
    color: shadowColorLight
  },
  {
    corners: [3, 4, 9],
    value: 0,
    color: shadowColorDarker
  },
  {
    corners: [5, 4, 9],
    value: 0,
    color: shadowColorLight
  },
  {
    corners: [3, 8, 2],
    value: 0,
    color: shadowColorDark
  },
  {
    corners: [1, 8, 2],
    value: 0,
    color: shadowColorDarker
  },
  {
    corners: [3, 8, 9],
    color: shadowColorSubtle
  }
]

class D20 {
  constructor(x, y, rng) {
    this.rng = rng;
    this.x = x;
    this.y = y;

    this.getValue();

    textFont(font);
    textAlign(CENTER);
  }

  getValue() {
    this.value = Math.ceil(map(this.rng.get(), 0, 1, 0.0001, 19.999));
  }

  drawNumber(size) {


    push();
    fill(this.colorSet.text);
    rotate(PI/2);
    textSize(size)

    push();
    blendMode(BLEND);
    noStroke();
    text(this.value, 0, size/3);
    pop();

    stroke(this.colorSet.text == utils.penColor ? highlightColor : shadowColorDarker);
    strokeWeight(utils.relSize(20 / settings.gridCount));
    fill('#808080')
    text(this.value, 0, size/3);

    pop();
  }

  getHexPoints() {
    let pointer = createVector(hexDiameter + utils.relSize(strokeSize/2), 0);
    let ps = []
    for (let a = 0; a < TWO_PI; a += (TWO_PI / 6)) {
      pointer.setHeading(a);
      ps.push({x: pointer.x, y: pointer.y});
    }
    return ps;
  }

  getTrianglePoints() {
    let pointer = createVector(triangleDiameter + utils.relSize(strokeSize/2), 0);
    let ps = [];
    for (let a = 0; a < TWO_PI; a += (TWO_PI / 3)) {
      pointer.setHeading(a);
      ps.push({x: pointer.x, y: pointer.y});
    }
    return ps;
  }

  labelPoints(ps) {
    textSize(utils.relSize(20));
    ps.forEach((p, i) => {
      text(i, p.x, p.y);
    });
  }

  drawShading() {
    let hexPoints = this.getHexPoints();
    let trianglePoints = this.getTrianglePoints();
    let allPoints = hexPoints.concat(trianglePoints);

    for (let index = 0; index < triangleMap.length; index++) {
      const t = triangleMap[index];
      const points = triangleMap[index].corners;

      blendMode(OVERLAY);
      fill(t.color);
      noStroke();

      beginShape();
      for (let j = 0; j < points.length; j++) {
        let p = allPoints[points[j]];
        vertex(p.x, p.y)
      }
      endShape(CLOSE);
    }
  }

  draw() {
    push();
    translate((this.x + 0.5) * settings.cellSize, (this.y + 0.5) * settings.cellSize);

    rotate(randomGaussian(-PI/2, (PI/6)));

    this.colorSet = getColorsFromValue(this.value);

    drawingContext.fillStyle = this.colorSet.gradient;
    drawingContext.strokeStyle = this.colorSet.gradient;

    strokeWeight(utils.relSize(strokeSize));
    drawHex(0, 0, hexDiameter);

    this.drawShading();
    this.drawNumber(triangleDiameter * 0.6);
    pop();
  }
}


function setup() {  
  utils.standardCanvas();

  r = new PseudoRandom();
  reset();

  noLoop();
}

function reset() {

  settings = {
    gridCount: random([2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]),    
    padding: utils.relSize(20)
  };

  settings.cellSize = (width / (settings.gridCount));
  settings.objectSize = settings.cellSize - (2*settings.padding);
  
  triangleDiameter = settings.objectSize / 3.333;
  hexDiameter = settings.objectSize/2;
  strokeJoin(ROUND);
  dice = [];
  for (let y = 0; y < settings.gridCount; y++) {
    let row = [];
    for (let x = 0; x < settings.gridCount; x++) {
      const d = new D20(x, y, r);
      row.push(d);
    }
    dice.push(row);
  }

}

function draw() {  
  background(utils.paperColor);
  utils.zoomOut(0.9);
  for (let y = 0; y < settings.gridCount; y++) {
    for (let x = 0; x < settings.gridCount; x++) {
      const d = dice[y][x];
      d.draw();
    }
  }

}


utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  