import p5 from 'p5';
import * as utils from '../../utils';
import threadColors from '../../utils/threadColors';
import pack from '../../utils/rectanglePack';

const pieceName = "Genuary day 29: Isometric perspective";

const gridCells = 25;
let cellSize, allColors, buildingColors, shadowColor;

function isometricToReal(xCoord, yCoord, zCoord) {
  yCoord = -yCoord;
  let x = (xCoord - zCoord) * cellSize * 2;
  let y = (xCoord + zCoord) * cellSize;
  y += (yCoord*2) * cellSize;
  return { x, y }
}

function vertexAt(x, y, z) {
  const c = isometricToReal(x, y, z);
  vertex(c.x, c.y);
}
function pointAt(x, y, z) {
  const c = isometricToReal(x, y, z);
  point(c.x, c.y);
}

let buildingIndex = 0;

function multiplyColors(c1, c2) {
  let c = [];
  for (let index = 0; index < c1.levels.length; index++) {
    const l1 = map(c1.levels[index], 0, 255, 0, 1);
    const l2 = map(c2.levels[index], 0, 255, 0, 1);
    c[index] = l1 * l2;
    c[index] = map(c[index], 0, 1, 0, 255);
  }
  return color(c);
}

class Building {
  constructor(x, z, w, l, h, c) {
    this.buildingIndex = buildingIndex;
    buildingIndex += 1;
    this.x = x;
    this.z = z; 
    this.w = w - random(0.1); // aka width eastwest blocks
    this.l = l - random(0.1); // aka length aka northsouth blocks
    this.h = h; // aka height aka how tall 

    this.roofHeight = random(0.6);
    this.roofType = random(['triangle', 'flat', 'triangle-flipped']);
    // this.roofType = 'triangle-flipped';

    if(this.roofType == 'flat') {
      this.roofHeight = 0;
    }

    this.boxHeight = this.h - this.roofHeight;

    this.color = color(c);
    this.buildGradients();
    this.highlightColor = lerpColor(this.color, color(255), 0.05);
  }

  buildGradients() {
    let buildingShadow = multiplyColors(this.color, shadowColor);
    let cs = this.getStartingCoordinates();
    this.shadowGradient1 = drawingContext.createLinearGradient(
      0,
      cs.yTop - cs.yBack,
      0,
      cs.yFront - cs.yBack
    );
    this.shadowGradient1.addColorStop(0, this.color);
    this.shadowGradient1.addColorStop(1, buildingShadow);
    
    let darkerBuildingShadow = multiplyColors(this.color, buildingShadow);

    this.shadowGradient2 = drawingContext.createLinearGradient(
      0,
      cs.yTop - cs.yBack,
      0,
      cs.yFront - cs.yBack
    );
    this.shadowGradient2.addColorStop(0, buildingShadow);
    this.shadowGradient2.addColorStop(1, darkerBuildingShadow);
  }

  resetDimensions(w, l) {
    this.w = w;
    this.l = l;
  }

  getZIndexAsItWere() {
    const result = this.getStartingCoordinates().y2;
    return result;
  }
  
  getStartingCoordinates() {
    const back = isometricToReal(this.x, 0, this.z);
    const front = isometricToReal(this.x + this.w, 0, this.z + this.l);
    const h = isometricToReal(this.x, this.h, this.z);
    const baseLeft = isometricToReal(this.x, 0, this.z + this.l);
    const baseRight = isometricToReal(this.x + this.w, 0, this.z);

    return {
      xCenter: back.x,
      xLeft: baseLeft.x,
      xRight: baseRight.x,

      yBack: back.y,
      yFront: front.y,
      yTop: h.y,
      yLeft: baseLeft.y,
      yRight: baseRight.y
    }
  }

  drawBox() {
    noStroke();

    this._drawLeftSide();
    this._drawRightSide();

  }

  _drawTop() {
    fill(this.color);
    stroke(this.highlightColor);

    beginShape();

    vertexAt(0, this.h, 0);
    vertexAt(this.w, this.h, 0);
    vertexAt(this.w, this.h, this.l);
    vertexAt(0, this.h, this.l); 

    endShape(CLOSE);
  }

  _drawBottom() {
    fill(this.color);
    beginShape();
    vertexAt(this.x, 0, this.z);
    vertexAt(this.x + this.w, 0, this.z);
    vertexAt(this.x + this.w, 0, this.z + this.l);
    vertexAt(this.x, 0, this.z + this.l); 

    endShape(CLOSE);
  }

  _drawLeftSide() {
    // fill(this.shadowColor1);
    push();
    drawingContext.fillStyle = this.shadowGradient1;
    beginShape()
    vertexAt(0, this.boxHeight, this.l);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w, 0, this.l);
    vertexAt(0, 0, this.l); 
    endShape(CLOSE);
    pop();
  }

  _drawRightSide() {
    push();
    drawingContext.fillStyle = this.shadowGradient2;
    beginShape()
    vertexAt(this.w, this.boxHeight, 0);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w, 0, this.l);
    vertexAt(this.w, 0, 0); 
    endShape(CLOSE);
    pop();
  }

  draw() {
    push();
    const newZero = this.getStartingCoordinates();
    translate(newZero.xCenter, newZero.yBack);

    this.drawBox();
    this.drawRoof();
    
    pop();
  }

  drawRoof() {
    switch (this.roofType) {
      case 'flat':
        this._drawTop();
        break;
      case 'triangle':
        this.drawTriangleRoof();
        break;
      case 'triangle-flipped':
        this.drawTriangleRoofFlipped();
        break;
      default:
        break;
    }
  }

  drawTriangleRoofFlipped() {
    noStroke();
    fill(this.highlightColor);

    beginShape();
    vertexAt(this.w/2, this.h, this.l);
    vertexAt(this.w/2, this.h, 0);
    vertexAt(0, this.boxHeight, 0);
    vertexAt(0, this.boxHeight, this.l);
    endShape(CLOSE);

    // front bit
    drawingContext.fillStyle = this.shadowGradient1;
    beginShape();
    vertexAt(0, this.boxHeight, this.l);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w/2, this.h, this.l);
    endShape(CLOSE);

    drawingContext.fillStyle = this.color;
    beginShape();
    vertexAt(this.w, this.boxHeight, 0);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w/2, this.h, this.l);
    vertexAt(this.w/2, this.h, 0);
    
    endShape(CLOSE);
  
  }

  drawTriangleRoof() {
    noStroke();

    drawingContext.fillStyle = this.shadowGradient1;
    beginShape();
    vertexAt(this.w, this.h, this.l/2);
    vertexAt(0, this.h,this.l/2);
    vertexAt(0, this.boxHeight, 0);
    vertexAt(this.w, this.boxHeight, 0);
    endShape(CLOSE);

    // front bit
    drawingContext.fillStyle = this.shadowGradient2;
    beginShape();
    vertexAt(this.w, this.boxHeight, 0);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w, this.h, this.l/2);
    endShape(CLOSE);

    drawingContext.fillStyle = this.color;
    beginShape();
    vertexAt(0, this.boxHeight, this.l);
    vertexAt(this.w, this.boxHeight, this.l);
    vertexAt(this.w, this.h, this.l/2);
    vertexAt(0, this.h,this.l/2);
    
    endShape(CLOSE);
  }
}

function roundToTwo(n) {
  return Number.parseFloat(n).toPrecision(4);
}

function setup() {  
  utils.standardCanvas();
  shadowColor = color('#ADA7C7');

  cellSize = width / gridCells;
  allColors = threadColors.filter((c) => c!== '#1E1108');


  // buildingColors = ['#594937','#455c71','#6a859e','#5F6648','#eccc9e','#CB9051','#B87748']
  reset();
  noLoop();
}

function reset() {
  utils.shuffleArray(allColors);
  buildingColors = allColors.slice(0, 3);
}

function createBlocks() {
  const roadWidth = random(0.5, 1.25);

  const area = {x: 0, y: 0, w: gridCells, h: gridCells};
  let blocks = [];

  const nsRoads = random(3, 10);
  const ewRoads = random(3, 10);
  // const nsRoads = 4;
  // const ewRoads = 4;

  const nsBlockSize = (area.w / nsRoads);
  const ewBlockSize = (area.h/ewRoads);

  let roads = [];

  for (let j = 0; j <= ewRoads; j++) {
    roads.push({
      x: 0,
      y: j * ewBlockSize - roadWidth,
      w: area.w,
      h: roadWidth
    });
  }

  for (let i = 0; i <= nsRoads; i++) {
    roads.push({
      x: i*nsBlockSize - roadWidth,
      y: 0,
      w: roadWidth,
      h: area.h
    });

    for (let j = 0; j <= ewRoads; j++) {
      blocks.push({
        x: i*nsBlockSize,
        y: j*ewBlockSize,
        w: nsBlockSize - roadWidth,
        h: ewBlockSize - roadWidth
      });
    }    
  }

  return {blocks, roads};
}

function draw() {
  background(utils.paperColor);
  utils.zoomOut(0.9);

  fill(utils.paperColor);
  stroke(utils.penColor);
  rect(0, 0, width, height);

  utils.zoomOut(0.8);

  let buildings = [];
  const {blocks, roads} = createBlocks();
  const opt =  {incrementBy: 0.6};

  let packed = pack(blocks, 0.5, opt);

  packed.forEach((p) => {
    if(random() > 0.1) {
      const buildingHeight = map(noise(p.x/10, p.y/10), 0, 1, 0.1, 4);
      buildings.push(new Building(
        p.x, 
        p.y, 
        p.w, 
        p.h, 
        buildingHeight, random(buildingColors)));
    } 
  })

  buildings = buildings.filter((b) => {
    let inFrame = true;
    let coords = b.getStartingCoordinates();
    // account for the transform

    coords.xLeft += width/2;
    coords.xRight += width/2;
    coords.yFront -= height/2 
    coords.yTop -= height/2;

    if(coords.xRight > width || coords.xLeft < 0) {
      inFrame = false;
    }

    if(coords.yFront > height || coords.yTop < 0) {
      inFrame = false;
    }
    return inFrame;
  });


  buildings.sort((a, b) => {
    const aCoords = a.getStartingCoordinates();
    const bCoords = b.getStartingCoordinates();

    // if it's definitely in behind, great
    if(aCoords.yFront < bCoords.yFront && aCoords.yBack < bCoords.yBack) {
      return -1;
    }
    // if it's definitely in front, great
    if(aCoords.yFront > bCoords.yFront && aCoords.yBack > bCoords.yBack) {
      return 1;
    }

    if(aCoords.xCenter > bCoords.xCenter) {
      return aCoords.yLeft - bCoords.yRight;
    } else {
      return aCoords.yRight - bCoords.yLeft;
    }
  });

  // roads.forEach((r) => {
  //   buildings.unshift(new Road(r.x, r.y, r.w, r.h));
  // });
  translate(width/2, -height/2);


  buildings.forEach((b) => {
    // console.log(b.getZIndexAsItWere());
    b.draw();
  });


}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  