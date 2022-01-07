import p5 from 'p5';
import * as utils from '../utils';

let sourceImage;
let ditherShader;
let noiseImages = [];
let shaderCanvas;
let drawCanvas;
let ditherTex;

let i_height;
let i_width;

const iosWidth = 784;
const iosHeight = 1392;
const aspectRatio = iosHeight/iosWidth;

let settings = {};

function preload() {
  sourceImage = loadImage('/ios.jpeg');
  noiseImages = [
    loadImage('/blue-noise1.png'),
    loadImage('/blue-noise2.png'),
    loadImage('/blue-noise3.png'),
    loadImage('/blue-noise4.png'),
    loadImage('/blue-noise5.png'),
    loadImage('/blue-noise6.png')
  ];

  ditherShader = loadShader('/shaders/g2.vert', '/shaders/g2.frag');
}

function setup() {

  shaderCanvas = utils.standardCanvas({ renderer: WEBGL });
  drawCanvas = utils.standardGraphics();

  reset();
  // frameRate(4);
}

function reset() {
  drawCanvas.resetMatrix();

  ditherTex = random(noiseImages);
  i_height = utils.relSize(800);
  i_width = i_height / aspectRatio; /// approx 450

  // const s = random();
  settings = {
    glareHeight: random(0.05, 0.5),
    glareOffset: random(0.05, 0.5),
    tiltAngle: random(-PI/4, PI/4)
  }


}

function positionPhone(amount) {
  // drawCanvas.push();
  drawCanvas.translate(width/2, height/2);
  drawCanvas.scale(amount, amount);
  drawCanvas.translate(-width/2, -height/2);
  // drawCanvas.pop();
}
function drawPhone() {
  drawCanvas.push();
  drawCanvas.translate(width/2, height/2);
  drawCanvas.scale(0.9, 0.9);
  drawCanvas.translate(-width/2, -height/2);
  drawCanvas.image(sourceImage, utils.relSize(275), utils.relSize(100), i_width, i_height);
  drawCanvas.pop();
}
function drawPhoneBorder(circle = false) {
  drawCanvas.stroke(200);
  drawCanvas.strokeWeight(utils.relSize(5));
  drawCanvas.fill(0);
  drawCanvas.rect(utils.relSize(275), utils.relSize(30), i_width + utils.relSize(10), i_height + utils.relSize(150), utils.relSize(50));
  if(circle) {
    drawCanvas.ellipse(utils.relSize(500), i_height + utils.relSize(120), utils.relSize(50))
  }
}

function anglePhone() {
  drawCanvas.translate(width/2, height/2);
  drawCanvas.shearX(settings.tiltAngle);
  drawCanvas.shearY(settings.tiltAngle / -5);
  drawCanvas.translate(-width/2, -height/2);
 
}

function drawPhoneReflection() {
  const reflectionZoneHeight = i_height + utils.relSize(50);
  const rHeight = reflectionZoneHeight * settings.glareHeight;
  const rOffset = reflectionZoneHeight * settings.glareOffset;

  let t = map(sin(frameCount/100), -1, 1, 0, 1) * (1 - settings.glareHeight - settings.glareOffset) * i_height;

  drawCanvas.noStroke();
  drawCanvas.fill('rgba(255, 255, 255, 0.3)')
  drawCanvas.beginShape();

  const leftSide = utils.relSize(275);
  const rightSide = utils.relSize(285) + i_width;

  const start = utils.relSize(80 + t);
  drawCanvas.vertex(leftSide, start);
  drawCanvas.vertex(leftSide, start + rHeight);
  drawCanvas.vertex(rightSide, start + rOffset + rHeight);
  drawCanvas.vertex(rightSide, start + rOffset);
  
  drawCanvas.endShape(); 
}

const phoneDepth = 30;

function draw() {
  if(frameCount % 40 == 0) {
    ditherTex = random(noiseImages);
  }
  drawCanvas.push();
  drawCanvas.background(0);
  positionPhone(0.7);

  drawCanvas.push();
  drawCanvas.translate(0, utils.relSize(phoneDepth));
  anglePhone();
  drawPhoneBorder(true);
  drawCanvas.pop();
  anglePhone();
  drawPhoneBorder(true);


  drawPhone();
  drawPhoneReflection();
  // drawCanvas.applyMatrix(utils.getMatrix(0.1));
  image(drawCanvas, -width/2, -height/2);
  ditherShader.setUniform('tex0', drawCanvas);
  ditherShader.setUniform('noisetex', ditherTex);

  // drawCanvas.fill(random(55) + 100);

  rect(-width/2, -height/2,width, height);
  shader(ditherShader);
  drawCanvas.pop();
}


const pieceName = "Dithering";

utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
