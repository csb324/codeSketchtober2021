import utils from './index';


function circleWindow() {
  ellipseMode(CORNER);
  const twoLoops = random([true, false]);
  const centerLoop = random([true, false]);
  const linesBetween = random([true, false]);

  return function(w, h) {    
    w = utils.relSize(w);
    h = utils.relSize(h);
    
    rect(0, 0, w, h);

    let circleSize = min(w, h) * 0.8;
    let xPadding = (w - circleSize)/2;
    let yPadding = (h - circleSize)/2;
    ellipse(xPadding, yPadding, circleSize)

    if(linesBetween) {
      line(xPadding + circleSize/2, yPadding, xPadding + circleSize/2, yPadding+circleSize);
      line(xPadding+circleSize, yPadding + circleSize/2, xPadding, yPadding + circleSize/2);
      noFill();
    }

    if(twoLoops) {
      circleSize = circleSize * 0.8;
      xPadding = (w - circleSize)/2;
      yPadding = (h - circleSize)/2;
      ellipse(xPadding, yPadding, circleSize)  
    }
    if(centerLoop) {
      fill(utils.paperColor)
      circleSize = max(circleSize * 0.1, utils.relSize(15));
      xPadding = (w - circleSize)/2;
      yPadding = (h - circleSize)/2;
      ellipse(xPadding, yPadding, circleSize)
    }
  }
}

function pointyWindow() {
  const windows = random([1, 2, 3, 4]);

  return function(w, h) {    
    w = utils.relSize(w);
    h = utils.relSize(h);
    rect(0, 0, w, h);

    h = random(0.6, 0.9) * h;

    const windowWidth = w / windows;
    const segmentHeight = h / windows;
    const m = utils.relSize(3);

    for (let index = 0; index < windows; index++) {
      const windowX = windowWidth * index;
      beginShape();
      vertex(windowX + windowWidth/2, 0);
      vertex(windowX + m + (windowWidth/12), segmentHeight/2);
      vertex(windowX + m, segmentHeight);
      vertex(windowX + m, h);
      vertex(windowX + windowWidth - m, h);
      vertex(windowX + windowWidth - m, segmentHeight);
      vertex(windowX - m + (windowWidth* (11/12)), segmentHeight/2);
      vertex(windowX + windowWidth/2, 0);
      endShape();      
    }

  }

}

function bricklike() { 
  const howManyRows = random([2, 3, 4]);
  return function(w, h) {    
    w = utils.relSize(w);
    h = utils.relSize(h);
    const rowHeight = h / howManyRows;
    for (let index = 0; index < howManyRows; index++) {
      rect(0, rowHeight*index, w, rowHeight);
    }
  }
}

function columns() {
  const howManyColumns = random([2, 3, 4]);
  return function(w, h) {
    w = utils.relSize(w);
    h = utils.relSize(h);

    const columnZoneWidth = w / howManyColumns;
    const columnHeadWidth = columnZoneWidth * 0.9;
    const columnBodyWidth = columnHeadWidth * 0.9;
    const columnHeadOffset = (columnZoneWidth * 0.05);
    const columnBodyOffset = (columnZoneWidth - columnBodyWidth)/2;
    const columnHeadHeight = columnHeadWidth * 0.2;

    for (let index = 0; index < howManyColumns; index++) {
      rect(columnZoneWidth*index + columnBodyOffset, 0, columnBodyWidth, h);
      fill(utils.paperColor);
      rect(columnZoneWidth*index + columnHeadOffset, 0, columnHeadWidth, columnHeadHeight);
      rect(columnZoneWidth*index + columnHeadOffset, h - columnHeadHeight, columnHeadWidth, columnHeadHeight);
    }
  }
}

function diamonds() {
  const howManyDiamonds = random([2, 3, 4]);
  return function(w, h) {
    w = utils.relSize(w);
    h = utils.relSize(h);

    rect(0, 0, w, h);
    if(w > h) {
      const diamondW = w/howManyDiamonds;
      let bottom = false;
      beginShape();
      for (let index = 0; index <= howManyDiamonds; index++) {
        if(bottom) {
          vertex(index*diamondW, h);
        } else {
          vertex(index*diamondW, 0);
        }
        bottom = !bottom;
      }
      endShape();

      beginShape();
      bottom = true;
      for (let index = 0; index <= howManyDiamonds; index++) {
        if(bottom) {
          vertex(index*diamondW, h);
        } else {
          vertex(index*diamondW, 0);
        }
        bottom = !bottom;
      }
      endShape();
    } else {
      const diamondH = h/howManyDiamonds;
      let bottom = false;
      beginShape();
      for (let index = 0; index <= howManyDiamonds; index++) {
        if(bottom) {
          vertex(w, index*diamondH);
        } else {
          vertex(0, index*diamondH);
        }
        bottom = !bottom;
      }
      endShape();

      beginShape();
      bottom = true;
      for (let index = 0; index <= howManyDiamonds; index++) {
        if(bottom) {
          vertex(w, index*diamondH);
        } else {
          vertex(0, index*diamondH);
        }
        bottom = !bottom;
      }
      endShape();
    }
  }
}

const basicFunctions = [circleWindow, pointyWindow, bricklike, columns, diamonds];

export default basicFunctions;