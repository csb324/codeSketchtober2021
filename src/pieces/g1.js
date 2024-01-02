
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "Genuary day 1: Particles";

let particlesEver = 0;
const maxParticles = 10;

const colors = ['#02c2c7', '#02c4c8', '#02c2c7', '#02c4c8', '#1192bf', '#a32ab4']

const prevailingVelocity = {x: 3, y: 0};

class Particle {

  constructor(color) {
    particlesEver += 1;
    this.fill = color;
    this.x = 0
    this.y = random(300, 700);
    this.toDelete = false;

    this.radius = random(10, 30);

    // this.vx = random(1, 3);
    this.vx = 3;
    // this.vy = random(0.2, -0.2);
    this.vy = 0;
    // this.vy = 1;

    // this.vy = 0;

    // this.seed = random(0, 360);
    this.seed = random(0, 360);
    this.vSeed = random(-0.2, 0.2);
    // this.vSeed = 0.1;

    // this.vDelta = random(-0.2, 0.2);
    this.vDelta = 0.2;

  }

  update() {

    this.seed += this.vSeed;

    let vvy = this.vDelta * 3 * (Math.sin(this.seed));

    if(vvy < 0 && Math.sin(this.seed - ( this.vSeed * 2 )) > 0) {
      console.log("Yooo")
      vvy *= 15;
    }

    // this.vx += vvy * 0.3;
    this.vx = (noise(this.seed) + 0.25) * (5 + Math.sin(this.seed));
    this.vy = (noise(this.seed + 1000) - 0.5) * 30;

    // this.vy -= Math.sin((this.y / 1000) * Math.PI * 0.01); // gravity

    this.x += this.vx;
    this.y += this.vy;

    // const distance = Math.sqrt((this.vx*this.vx) + (this.vy*this.vy));
    // this.radius = Math.max(this.radius, distance);

    if(this.x < 0 - this.radius || this.y < 0 - this.radius || this.x > 1000 + this.radius || this.y > 1000 + this.radius){
      this.toDelete = true;
    }
  }

  show() {
    fill(this.fill);
    noStroke();

    // ellipse(utils.relSize(this.x), utils.relSize(this.y), utils.relSize(this.radius))

    ellipse(utils.relSize(this.x + random(this.radius)), utils.relSize(this.y - random(this.radius)), utils.relSize(this.radius));
    ellipse(utils.relSize(this.x + random(this.radius)), utils.relSize(this.y + random(this.radius)), utils.relSize(random(this.radius)));
    ellipse(utils.relSize(this.x - random(this.radius)), utils.relSize(this.y + random(this.radius)), utils.relSize(random(this.radius)));
    ellipse(utils.relSize(this.x - random(this.radius)), utils.relSize(this.y - random(this.radius)), utils.relSize(this.radius));
  }

}

let particles = []; 


function setup() {  
  utils.standardCanvas();
  fill(utils.paperColor);
  rect(0, 0, width, height);

  reset();
}

function reset() {
  fill(utils.paperColor);
  noStroke();
  rect(0, 0, width, height);

  particlesEver = 0;

  particles = [];
  loop();
}

function draw() {
  particles = particles.filter((p) => !p.toDelete)

  if(particlesEver < maxParticles) {
    let c = random(colors);

    if(particlesEver == maxParticles) {
      c = colors[5]
    }

    particles.push(new Particle(c));

  }

  if (particles.length == 0) {
    noFill();
    stroke(colors[2]);
    strokeWeight(utils.relSize(5));
    rect(utils.relSize(50), utils.relSize(50), utils.relSize(900), utils.relSize(900))

    noStroke();
    fill(colors[2]);
    textSize(utils.relSize(20));
    textAlign(RIGHT, TOP);
    text("JAZZ", utils.relSize(950), utils.relSize(960));
    noLoop();
  }

  particles.forEach((p) => {
    p.update();
    p.update();
    p.show();  
  } )
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  