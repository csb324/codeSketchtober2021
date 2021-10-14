import p5 from 'p5';
import * as utils from './index';
// originally for day 3, but became useful for day 8 as well

export default class Rock {
  constructor(x, y, w, h) {
    this.points = this.baseRockPoints(w, h);
    this.howManyDeforms = floor(random(2, 4));
    this.howManyRidges = floor(random(1, 5));
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.strokeColor = color('#efefef');

  }

  setColor() {
    // placeholder
  }

  deformAndDraw(a) {
    if(a.length == 0) {
      return [];
    }
    a = this.deform(a);
    this.drawShape(a);
    return a;
  }

  baseRockPoints(w, h) {
    let points = [];
    for (let r = 0; r < TWO_PI; r+= random(PI * 0.5)) {
      points.push({x: cos(r) * w/2, y:sin(r) * h/2})   
    }
    return points;
  }

  draw() {
    let deformedPoints = [...this.points];
    push();
    translate(this.x + (this.w/2), this.y + (this.h/2));
    noStroke();
  
    this.setColor();
    this.drawShape(this.points);
    for (let i = 0; i < this.howManyDeforms; i++) {
      deformedPoints = this.deformAndDraw(deformedPoints);
      if(i == 0 || random() > 0.5) {
        this.deformAndDraw(this.reduce(deformedPoints));
        if(random() > 0.5) {
          this.deformAndDraw(this.reduce(deformedPoints));
        }
      }
    }
    for (let i = 0; i < this.howManyRidges; i++) {
      this.drawRidge(deformedPoints);
    }
    pop();
  }
  
  drawShape(pointsArray) {
    if(random() > 0.7) {
      this.setColor();
    }
  
    beginShape()
    for (let index = 0; index < pointsArray.length; index++) {
      const p = pointsArray[index];
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  drawRidge(pointsArray) {
    this.strokeColor.setAlpha(random(10, 40));
    strokeWeight(utils.relSize(random(1, 3)));
    stroke(this.strokeColor);
    const p1 = random(pointsArray);
    const p2 = random(pointsArray);  
    line(p1.x, p1.y, p2.x, p2.y);
  }

  reduce(array) {
    const r = random(100);
    const nArray = array.filter((_e, i) => noise(i/array.length, r) > 0.5);
    if (nArray.length > 2) {
      return nArray;
    } else {
      // sometimes something weird happens with like, the number 29? 
      // anyway, this fixed it.
      // life's too short to find out what's wrong with the number 29
      noiseSeed(random(1000));
      return this.reduce(array);
    }
  }

  deform(array) {
    let na = [];
    array.push(array[0]);
  
    for (let i = 1; i < array.length; i++) {
      const element = array[i];
      const last = array[i-1];
      na.push(last);
  
      const v1 = createVector(element.x, element.y);
      const v2 = createVector(last.x, last.y);
  
      const movement = v1.copy().sub(v2);
  
      movement.mult(0.5);
      movement.add(p5.Vector.random2D().setMag(movement.mag() * 0.2));
  
      v1.sub(movement);
      const newPoint = {x: v1.x, y: v1.y, new: true};
      na.push(newPoint);
    }
  
    // return array;
    // na.push(array[array.length-1]);
    return na;
  }
  
}