import * as utils from './index';


export default class LifeSaver {

  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.distortions = [];
    this.addDistortions();
  }

  addDistortions() {
    const slices = random(5, 15);
    for (let index = 0; index < slices; index++) {
      const scaleFactor = random(0.8, 1.2);
      const sizeFactor = random(0.25, 1);
      const rotationFactor = random(PI * 2);
      const isArc = random([true, false]);
      const wedgeStart = random(PI);
      const wedgeEnd = wedgeStart + (random(PI/4));
      this.distortions.push({
        scaleFactor, sizeFactor, rotationFactor, isArc, wedgeStart, wedgeEnd
      });
    }

  }


  drawDEBUG() {
    push();
    drawingContext.fillStyle = this.c;

    translate(this.x, this.y);
    rect(0, 0, this.w, this.h);
    pop();
  }

  drawDistortions() {
    
    this.distortions.forEach((d) => {
      push();
      rotate(d.rotationFactor);
      scale(1/d.scaleFactor, 1/d.scaleFactor);

      if(d.isArc) {
        rect(0, this.h * 0.175 * d.scaleFactor, utils.relSize(5), this.h * 0.3 * d.scaleFactor);
      } else {
        arc(0, 0, 
          this.w * d.scaleFactor * d.sizeFactor, 
          this.h * d.scaleFactor * d.sizeFactor, 
          d.wedgeStart, d.wedgeEnd
        );          
      }

      pop();

    })
  }
  draw() {
    // const slices = 0;
    push();
    translate(this.x, this.y);
    noStroke();

    push();
    drawingContext.fillStyle = this.c;
    ellipse(0, 0, this.w, this.h);

    this.drawDistortions();


    blendMode(MULTIPLY);
    ellipse(0, -this.h * 0.05, this.w*0.29, this.h*0.27);
    pop();

    blendMode(BLEND);
    fill(utils.paperColor);
    ellipse(0, 0, this.w/4, this.h*0.23);
    pop();
  }
}
