
import p5 from 'p5';
import * as utils from '../../utils';
import threadColors from '../../utils/threadColors';
import wiggleLine from '../../utils/wiggleLine';

const pieceName = "Genuary day 31: Negative space";

function setup() {  
  utils.standardCanvas();
  reset();
  // frameRate(4);
  noLoop();
}

class Calendar {
  constructor() {
    this.dayboxes = [];
    this.daysCount = 31;
    this.startingWeekday = 6; // saturday

    this.createWeeks();
    this.dayboxes.forEach((d) => d.establishNeighbors()); 
  }

  createWeeks() {
    let wd = this.startingWeekday;
    let wi = 0;
    for (let i = 0; i < this.daysCount; i++) {
      const d = new DayBox(wd, wi, i, this);
      wd += 1;
      if(wd >= 7) {
        wd = 0;
        wi += 1;
      }
      this.dayboxes.push(d);
    }
  }

  at(i) {
    if(i < 0 || i >= this.daysCount) {
      return false;
    } 
    return this.dayboxes[i];
  }

  draw() {
    this.dayboxes.forEach((d) => d.draw());
  }
}

class DayBox {
  constructor(weekday, weekNo, dayNo, calendar) {
    this.weekday = weekday;
    this.weekNo = weekNo;
    this.dayNo = dayNo;
    this.calendar = calendar;

    this.linesToDraw = random(6, 15);

    this.x = SQUARE_SIZE * this.weekday + (PADDING/2) + OFFSET_X;
    this.y = SQUARE_SIZE * this.weekNo + (PADDING/2) + OFFSET_Y;
    this.w = SQUARE_SIZE - PADDING;
    this.x2 = this.x + this.w;
    this.y2 = this.y + this.w; // it square

    this.borderPoints = this.getPoints();
  }

  establishNeighbors() {

    this.upNeighbor = this.calendar.at(this.dayNo - 7);
    this.downNeighbor = this.calendar.at(this.dayNo + 7);

    if(this.weekday > 0) {
      this.leftNeighbor = this.calendar.at(this.dayNo - 1);
    } else {
      this.leftNeighbor = false;
    }

    if(this.weekday < 6) {
      this.rightNeighbor = this.calendar.at(this.dayNo + 1);
    } else {
      this.rightNeighbor = false;
    }
  }

  getPointsForNeighbor(key) {
    let result = [...this.borderPoints[key]];

    if(['top', 'bottom'].includes(key)) {
      if(this.rightNeighbor) {
        result.push(random(this.rightNeighbor.borderPoints[key]));
      }
      if(this.leftNeighbor) {
        result.push(random(this.leftNeighbor.borderPoints[key]))
      }
    } else {
      if(this.upNeighbor) {
        result.push(random(this.upNeighbor.borderPoints[key]));
      }
      if(this.downNeighbor) {
        result.push(random(this.downNeighbor.borderPoints[key]));
      }
    }
    return result;
  }

  getPoints() {
    let t = [], l = [], r = [], b = [];
    const pointsPerSide = 10;

    for (let index = 0; index < pointsPerSide; index++) {
      const xVar = map(random(-0.5, 0.5) + index, -0.5, pointsPerSide + 0.5, this.x, this.x2);
      const yVar = map(random(-0.5, 0.5) + index, -0.5, pointsPerSide + 0.5, this.y, this.y2);

      t.push({x: xVar, y: this.y});
      b.push({x: xVar, y: this.y2});
      l.push({x: this.x, y: yVar});
      r.push({x: this.x2, y: yVar});
    }

    return {
      top: t,
      left: l,
      right: r,
      bottom: b
    }

  }

  draw() {
    for (let index = 0; index < this.linesToDraw; index++) {
      this.drawNeighborLine(this.leftNeighbor, 'left');
      this.drawNeighborLine(this.downNeighbor, 'bottom');
      this.drawNeighborLine(this.upNeighbor, 'top');
      this.drawNeighborLine(this.rightNeighbor, 'right');
    }
  }

  opposite(sideName) {
    const sides = {
      'top': 'bottom',
      'bottom': 'top',
      'left': 'right',
      'right': 'left'
    }
    return sides[sideName];
  }

  drawNeighborLine(neighbor, mySide) {

    stroke(random(colors));
    strokeWeight(utils.relSize(random(3)));

    let start = random(this.borderPoints[mySide]);
    let end;
    if(neighbor) {
      end = random(neighbor.getPointsForNeighbor(this.opposite(mySide)));
    } else {
      end = {};
      if(['top', 'bottom'].includes(mySide)) {
        end.x = random(this.x - PADDING, this.x2 + PADDING);
        end.y = (mySide == 'top') ? (random(0, OFFSET_Y*MINIMUM_SCRAMBLE)) : height - random(0, OFFSET_Y*MINIMUM_SCRAMBLE);
      } else {
        end.y = random(this.y - PADDING, this.y2 + PADDING);
        end.x = (mySide == 'left') ? (random(0, OFFSET_X*MINIMUM_SCRAMBLE)) : width - random(0, OFFSET_X*MINIMUM_SCRAMBLE);
      }
    }


    if(ROUGH_EDGES) {
      start = roughen(start);
      end = roughen(end);
    }

    if(WIGGLE) {
      wiggleLine(start.x, start.y, end.x, end.y, false);
    } else {
      line(start.x, start.y, end.x, end.y);
    }
  } 
}

function roughen({x, y}) {
  const amount = SQUARE_SIZE * 0.1;
  let newX = x + utils.relSize(random(-amount, amount));
  let newY = y + utils.relSize(random(-amount, amount));
  return {
    x: newX, y: newY
  };
}

let c;
let PADDING, OFFSET_X, OFFSET_Y, SQUARE_SIZE, MINIMUM_SCRAMBLE, WIGGLE, ROUGH_EDGES;
let colors;

function reset() {
  clear();
  background(utils.paperColor);


  SQUARE_SIZE = random(width/12, width/8);
  OFFSET_X = (width - 7*SQUARE_SIZE) / 2;
  OFFSET_Y = (width - 6*SQUARE_SIZE) / 2;

  MINIMUM_SCRAMBLE = random(0.3, 0.7);

  PADDING = random(0.2, 0.4) * SQUARE_SIZE;
  WIGGLE = random([true, false]);
  ROUGH_EDGES = random([true, false]);
  // ROUGH_EDGES = false;

  let t = [...threadColors];
  utils.shuffleArray(t);
  colors = t.slice(0, random(2, 5));
  c = new Calendar();
}

function draw() {
  utils.zoomOut(0.9);
  strokeWeight(utils.relSize(3));
  noFill();
  c.draw();
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  