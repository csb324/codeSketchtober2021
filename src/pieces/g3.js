import p5 from 'p5';
import * as utils from '../utils';
import rectanglePack from '../utils/rectanglePack';
import wiggleLine from '../utils/wiggleLine';

const pieceName = "Genuary day 3: Droste";


let h;
let bgColor;
let palette;

const SPEED = 0.008;

class DrosteHouse {
  constructor() {
    this.seed = random(frameCount);
    this.progress = 0;
    this.roomAreas = rectanglePack([{x: 0, y:0, w:1000, h:1000}], 200);
    
    this.nextRoomArea = random(this.roomAreas);
    this.nextRoom = false;

    this.xMultiplier = 1;
    this.yMultiplier = 1;
  }

  setMultipliers(x, y) {
    this.xMultiplier = x;
    this.yMultiplier = y;
  } 

  update() {
    this.progress += SPEED;

    if(this.progress > 0.5 && !this.nextRoom) {
      // let cx = this.nextRoomArea.x + this.nextRoomArea.w/2;
      // let cy = this.nextRoomArea.y + this.nextRoomArea.h/2;
      
      this.nextRoom = new DrosteHouse();
      this.nextRoom.setMultipliers(this.nextRoomArea.w/1000, this.nextRoomArea.h/1000);
    }

    if(this.nextRoom) {
      this.nextRoom.update();
    }

    if(this.progress > 3) {
      h = this.nextRoom;
    }
  }

  draw() { 
    randomSeed(this.seed);

    push();

    if(this.progress < 1) {
      scale(
        map(this.progress, 0, 1, 0, this.xMultiplier),
        map(this.progress, 0, 1, 0, this.yMultiplier)
      );

      this.roomAreas.forEach((b) => {
        this.drawArea({
          x: b.x,
          y: b.y,
          w: b.w,
          h: b.h
        });
      });
  
    } else {
      scale(
        map(this.progress, 1, 2, this.xMultiplier, 1),
        map(this.progress, 1, 2, this.yMultiplier, 1)
      )

      this.roomAreas.forEach((b) => {
        this.drawArea({
          x: map(this.progress, 1, 2, b.x, 0),
          y: map(this.progress, 1, 2, b.y, 0),
          w: b.w,
          h: b.h
        });
      });

    }


    // let mx = this.xMultiplier || this.progress;
    let mx = 1;
    let my = 1;

    console.log(this.nextRoomArea)
    // let my = this.yMultiplier || this.progress;
    

    if(this.nextRoom) {
      translate(utils.relSize(this.nextRoomArea.x), utils.relSize(this.nextRoomArea.y));  

      this.nextRoom.draw();
    }
    pop();

  }

  drawArea({x, y, w, h}) {
    let areaColor = random(["#f194b4","#ffb100","#ffebc6"]);
    if(x == this.nextRoomArea.x && y == this.nextRoomArea.y) {
      areaColor = '#ff0000'
    }
    stroke(bgColor);
    fill(areaColor);

    push();

    translate(utils.relSize(x), utils.relSize(y));
    rect(0, 0, utils.relSize(w), utils.relSize(h));
    noFill();
    this.wiggleBox(0, 0, utils.relSize(w), utils.relSize(h));    
    pop();
  }

  wiggleBox(x1, y1, x2, y2) {
    wiggleLine(x1, y1, x1, y2);
    wiggleLine(x1, y1, x1, y2);

    wiggleLine(x2, y1, x2, y2);
    wiggleLine(x2, y1, x2, y2);

    wiggleLine(x1, y1, x2, y1);
    wiggleLine(x1, y1, x2, y1);

    wiggleLine(x1, y2, x2, y2);
    wiggleLine(x1, y2, x2, y2);
  }

}

function setup() {  
  utils.standardCanvas();
  reset();
}

function reset() {
  palette = ["#8cbcb9","#ff0000","#f194b4","#ffb100","#ffebc6"]
  bgColor = utils.paperColor;
  h = new DrosteHouse(500, 500);
}

function draw() {
  fill(bgColor);
  rect(0, 0, utils.relSize(1000), utils.relSize(1000));

  h.update();
  h.draw();

  // h = h.handOff() || h;
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  