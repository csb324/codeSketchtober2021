import rectanglePack from './rectanglePack';
import utils from './index';
import doorFunctions from './cathedralDoorFunctions';
import roofFunctions from './cathedralRoofFunctions';
import basicFunctions from './cathedralFunctions';


class CathedralBrick {
  constructor({x, y, w, h}, settings, computed, center = false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.settings = settings;
    this.computed = computed;
    this.center = center;
    this.assignType();
  }

  assignType() {
    if(this.center && this.y + this.h == (1000 - this.computed.yPadding)) {
      this.type = random(doorFunctions)();
    } else if (this.y == this.computed.yPadding) {
      this.type = random(roofFunctions)();
    } else {
      this.type = random(basicFunctions)();
    }
  }

  drawToType() {
    push();
    translate(utils.relSize(this.x), utils.relSize(this.y));
    if (this.type) {
      this.type(this.w, this.h);
    } else {
      rect(0, 0, utils.relSize(this.w), utils.relSize(this.h));
    }
    pop();
  }

  draw() {
    if(this.center) {
      this.drawToType();
    } else {
      push();
      this.drawToType();
      translate(width/2, height/2);
      scale(-1, 1);
      translate(-width/2, -height/2);
      this.drawToType();
      pop();  
    }

  }

}

export default class Cathedral {
  constructor(settings, computed) {
    this.bricks = [];
    let subsegments = [{
      x: computed.xPadding, 
      y: computed.yPadding, 
      w: computed.sideWidth, 
      h: settings.buildingHeight
    }];
    let leftSide = rectanglePack(subsegments, 80);
    let center = [
      {
        x: computed.entranceStartX, 
        y: computed.entranceStartY, 
        w: settings.entranceWidth, 
        h: settings.entranceHeight
      }
    ];
    center = rectanglePack(center, 150);
    center = center.map((s) => { return new CathedralBrick(s, settings, computed, true) })
    leftSide = leftSide.map((s) => { return new CathedralBrick(s, settings, computed) })
    this.bricks = leftSide.concat(center);
  }

  draw() { 
    this.bricks.forEach((b) => b.draw());
  }
}