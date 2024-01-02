
import p5 from 'p5';
import * as utils from '../../utils';
import rectanglePack from '../../utils/rectanglePack';

const pieceName = "Genuary day 17: Three colors";

let white = utils.paperColor;

const allColors = [
  '#A37BA7','#D29FC3','#69885A','#5C5478','#ADA7C7','#B87748',
  '#CB9051','#A7132B','#803A6B','#E24874','#FFA4BE','#FFC0CD',
  '#056517','#fdd755','#eccc9e','#ff8b00',
  '#87071f','#94a8c6','#11416d','#ce9124','#ffbf57',
  '#bddded','#594937','#455c71','#6a859e','#2696b6',
  '#30c2ec','#5F6648','#71935C','#CCD9B1','#1E1108','#F05454','#30475E','#FF9179'
]

let colors = [];
function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

let areas;
let skewMagnitude, noiseDivisor;
let blocks = [];

function reset() {
  utils.shuffleArray(allColors);
  colors = allColors.slice(0, 3);
  skewMagnitude = utils.relSize(random(10, 40));
  noiseDivisor = random(50, 100);

  const square = {x: 0, y:0, w:width, h:height}
  areas = rectanglePack([square], utils.relSize(80), {smallestPossible: true});
  // areas = rectanglePack([square], utils.relSize(400), {smallestPossible: true});
  noStroke();
  blocks = [];
  areas.forEach((a) => {
    if(random() < 0.1) {
      blocks.push(new CityTriangles(a))
    } else if (random() < 0.1) {
      blocks.push(new CityPlaza(a));

    } else {
      blocks.push(new CitySquare(a));
    }
  });

  const howManySecondary = random(areas.length/10, areas.length / 3);
  const howManyTertiary = random(1, areas.length / 60);

  for (let i = 0; i < howManySecondary; i++) {
    random(blocks).setColor(colors[1]);
    if(i < howManyTertiary) {
      random(blocks).setColor(colors[2]);
    }
  }

}

class CitySquare {
  constructor({x, y, w, h}) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = w + x;
    this.y2 = y + h;
    this.w = w;
    this.h = h;
    this.color = colors[0];
    this.skewMagnitude = skewMagnitude;

    this.needsAnchors = false;
    
    this.setPolarity();
    this.buildCorners();
  }

  setColor(c) {
    if(c == colors[1] && this.color == colors[2]) {
      return;
    }
    this.color = c;
  }

  setPolarity() {

    if (this.w > utils.relSize(200)) {
      this.needsAnchors = true;
      this.whichAlley = false;      
    } else {
      this.whichAlley = random([0, 0, 0, 0, 0, 0, 0, 0,0,0,0, 0, 1, 2, 3, 4])
    }
    this.polarityIntensity = 1;

    if(random() < 0.02) {
      this.polarityIntensity = random(2, 4);
    }

    if(this.polarityIntensity > 1) {
      this.whichAlley = false;
    } 


  }

  buildCorner(x0, y0, xPolarity, yPolarity) {
    return {
      x0: x0,
      y0: y0,
      x: x0 + this.propMutation(x0, xPolarity),
      y: y0 + this.propMutation(y0, yPolarity)
    };
  }

  buildTopAlley() {
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1, -0.5, 1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -0.5, 1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, 0.5, 1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1, 0.5, 1
    ));
  }
  buildRightAlley() {
    this.corners.push(this.buildCorner(
      this.x2, this.y1 + this.h/2, -1, -0.5
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -1, -0.5
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -1, 0.5
    ));
    this.corners.push(this.buildCorner(
      this.x2, this.y1 + this.h/2, -1, 0.5
    ));
  }
  buildBottomAlley() {
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y2, 0.5, -1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, 0.5, 1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -0.5, 1
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y2, -0.5, -1
    ));
  }
  buildLeftAlley() {
    this.corners.push(this.buildCorner(
      this.x1, this.y1 + this.h/2, 1, 0.5
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -1, 0.5
    ));
    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1 + this.h/2, -1, -0.5
    ));
    this.corners.push(this.buildCorner(
      this.x1, this.y1 + this.h/2, 1, -0.5
    ));
  }

  buildCorners() {
    this.corners = [];
    this.corners.push(this.buildCorner(
      this.x1, this.y1, 1, 1
    ));
      if(this.needsAnchors) {
        this.corners.push(this.buildCorner(this.x1 + this.w/2, this.y1, 0, 1));
      }
      if(this.whichAlley == 1) {
        this.buildTopAlley();
      }
    this.corners.push(this.buildCorner(
      this.x2, this.y1, -1, 1
    ));
      if(this.needsAnchors) {
        this.corners.push(this.buildCorner(this.x2, this.y1 + this.height/2, -1, 0));
      }
      if(this.whichAlley == 2) {
        this.buildRightAlley();
      }
    this.corners.push(this.buildCorner(
      this.x2, this.y2, -1, -1
    ));
      if(this.needsAnchors) {
        this.corners.push(this.buildCorner(this.x1 + this.w/2, this.y2, 0, -1));
      }
      if(this.whichAlley == 3) {
        this.buildBottomAlley();
      }
    this.corners.push(this.buildCorner(
      this.x1, this.y2, 1, -1
    ));

      if(this.whichAlley == 4) {
        this.buildLeftAlley();
      }
      if(this.needsAnchors) {
        this.corners.push(this.buildCorner(this.x1, this.y1 + this.height/2, 1, 0));
      }

  }

  propMutation(p, polarity) {
    const streetMin = utils.relSize(6);
    const streetMax = utils.relSize(12);
    if(p == 0 && Math.abs(polarity) <= 1) {
      return 0;
    }
    if(p >= (height-5) && Math.abs(polarity) <= 1) {
      return 0;
    }

    let change = polarity * map(
      noise(p / 10), 0, 1, streetMin, streetMax
    ) * this.polarityIntensity;

    return change;
  }

  drawCorner(corner) {
    const x = corner.x0;
    const y = corner.y0;

    let offsetX = map(
      noise(x/noiseDivisor, y/noiseDivisor, 5 + 4 * sin(fract(frameCount / 1000) * TWO_PI)), 0, 1, -this.skewMagnitude, this.skewMagnitude
    );
    let offsetY = map(
      noise(x/noiseDivisor, y/noiseDivisor, 100 + 10 * cos(fract(frameCount/837) * TWO_PI)), 0, 1, -this.skewMagnitude, this.skewMagnitude
    );
    if(x == 0 || x >= width-5) {
      offsetX = 0;
    }
    if(y == 0 || y >= height-5) {
      offsetY = 0;
    }

    // if(off)

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


class CityTriangles extends CitySquare {
  setPolarity() {
    this.polarityIntensity = 1;
    this.triangleDirection = random([true, false]);
  }

  buildCorners() {
    let triangle1 = [];
    let triangle2 = [];

    if(this.triangleDirection) {
      triangle1.push(this.buildCorner(
        this.x1, this.y1, 2, 1
      ));
      triangle1.push(this.buildCorner(
        this.x2, this.y1, -1, 1
      ));
      triangle1.push(this.buildCorner(
        this.x2, this.y2, -1, -2
      ));

      triangle2.push(this.buildCorner(
        this.x2, this.y2, -2, -1
      ));
      triangle2.push(this.buildCorner(
        this.x1, this.y2, 1, -1
      ));
      triangle2.push(this.buildCorner(
        this.x1, this.y1, 1, 2
      ));
    } else {
      triangle1.push(this.buildCorner(
        this.x2, this.y1, -1, 2
      ));
      triangle1.push(this.buildCorner(
        this.x2, this.y2, -1, -1
      ));
      triangle1.push(this.buildCorner(
        this.x1, this.y2, 2, -1
      ));

      triangle2.push(this.buildCorner(
        this.x1, this.y2, 1, -2
      ));
      triangle2.push(this.buildCorner(
        this.x1, this.y1, 1, 1
      ));
      triangle2.push(this.buildCorner(
        this.x2, this.y1, -2, 1
      ));


    }

    this.corners = [triangle1, triangle2];
  }


  draw() {

    fill(this.color);

    this.corners.forEach((cs) => {
      beginShape();
      cs.forEach((c) => this.drawCorner(c));
      endShape(CLOSE);

      if(random() > 0.33) {
        fill(colors[0]);
      }
    })
  }

}


class CityPlaza extends CitySquare {
  setPolarity() {
    this.polarityIntensity = 1;
  }

  buildCorners() {
    this.corners = [];

    this.corners.push(this.buildCorner(
      this.x1, this.y1, 2, 2
    ));

    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y1, 0, 1
    ));

    this.corners.push(this.buildCorner(
      this.x2, this.y1, -2, 2
    ));

    this.corners.push(this.buildCorner(
      this.x2, this.y1 + this.h/2, -1, 0
    ));

    this.corners.push(this.buildCorner(
      this.x2, this.y2, -2, -2
    ));

    this.corners.push(this.buildCorner(
      this.x1 + this.w/2, this.y2, 0, -1
    ));

    this.corners.push(this.buildCorner(
      this.x1, this.y2, 2, -2
    ));
    this.corners.push(this.buildCorner(
      this.x1, this.y1 + this.h/2, 1, 0
    ));


  }
}

function draw() {
  background(white);
  utils.zoomOut(0.8);

  blocks.forEach((b) => b.draw());

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  