import p5 from 'p5';
import * as utils from '../utils';

let drawFunctions;
let squareSize;
let lineDashes = [];

const SQRT2 = Math.SQRT2


function showMessage() {
  const area = document.getElementById('js-message')
  area.append("Based on Sol LeWitt's ");
  const link = document.createElement('a');
  link.innerText = "Wall Drawing #260";
  link.setAttribute("href", "https://www.moma.org/collection/works/79898?");
  link.setAttribute("target", "_blank");
  area.append(link);
}


function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
  showMessage();

  drawFunctions = [
    function() {
      arc(0, squareSize, squareSize*2, squareSize*2, -HALF_PI, 0); // one
    },
    function() {
      arc(0, 0, squareSize*2, squareSize*2, 0, HALF_PI); // two
    },
    function() {
      arc(squareSize, 0, squareSize*2, squareSize*2, HALF_PI, PI); // three
    },
    function() {
      arc(squareSize, squareSize, squareSize*2, squareSize*2, PI, 3*HALF_PI); // four
    },
    function() {
      const arcDiameter = SQRT2 * squareSize;
      arc(0, squareSize/2, arcDiameter, arcDiameter, PI * -0.25, PI * 0.25); // five
    },
    function() {
      const arcDiameter = SQRT2 * squareSize;
      arc(squareSize/2, 0, arcDiameter, arcDiameter, PI * 0.25, PI * 0.75); // six
    },
    function() {
      const arcDiameter = SQRT2 * squareSize;
      arc(squareSize, squareSize/2, arcDiameter, arcDiameter, PI * 0.75, PI * 1.25); // seven
    },
    function() {
      const arcDiameter = SQRT2 * squareSize;
      arc(squareSize/2, squareSize, arcDiameter, arcDiameter, PI * 1.25, PI * 1.75); // eight
    },

    function() {
      line(squareSize/2, 0, squareSize/2, squareSize); // nine
    },
    function() {
      line(0, squareSize/2, squareSize, squareSize/2); // ten
    },
    function() {
      line(0, 0, squareSize, squareSize); // eleven
    },
    function() {
      line(0, squareSize, squareSize, 0); // twelve
    },

    function() { // thirteen
      beginShape();
      const steps = 5;
      const variation = squareSize / 20;
      const distance = squareSize / steps;

      vertex(squareSize/2, 0);
      vertex(squareSize/2, 0);
      for (let index = 1; index < steps-1; index++) {
        curveVertex(squareSize/2 + (random(-variation, variation)), index * distance + (random(-variation, variation))/5);
      }

      vertex(squareSize/2, squareSize);
      vertex(squareSize/2, squareSize);

      endShape();
    },

    function() { // fourteen
      beginShape();
      const steps = random(3, 7);
      const variation = squareSize / 20;
      const distance = squareSize / steps;

      vertex(0, squareSize/2);
      vertex(0, squareSize/2);
      for (let index = 1; index < steps-1; index++) {
        curveVertex(
          index * distance + (random(-variation, variation))/5,
          squareSize/2 + (random(-variation, variation))
        );
      }

      vertex(squareSize, squareSize/2);
      vertex(squareSize, squareSize/2);

      endShape();
    },


    function() { // fifteen
      beginShape();
      const steps = random(5, 10);
      const variation = squareSize / 20;
      const distance = squareSize / steps;

      vertex(0, 0);
      vertex(0, 0);
      for (let index = 1; index < steps-1; index++) {
        curveVertex(
          index * distance + (random(-variation, variation))/5,
          index * distance + (random(-variation, variation))
        );
      }

      vertex(squareSize, squareSize);
      vertex(squareSize, squareSize);

      endShape();
    },
    // thirteen fourteen fifteen sixteen
    function() { // fifteen
      beginShape();
      const steps = random(5, 10);
      const variation = squareSize / 20;
      const distance = squareSize / steps;

      vertex(0, squareSize);
      vertex(0, squareSize);
      for (let index = 1; index < steps-1; index++) {
        curveVertex(
          index * distance + (random(-variation, variation))/5,
          map(index * distance + (random(-variation, variation)), 0, squareSize, squareSize, 0, true)
        );
      }

      vertex(squareSize, 0);
      vertex(squareSize, 0);

      endShape();
    },

    function() {
      push();
      drawingContext.setLineDash(lineDashes);
      line(squareSize/2, 0, squareSize/2, squareSize); // 17
      pop();
    },
    function() {
      push();
      drawingContext.setLineDash(lineDashes);
      line(0, squareSize/2, squareSize, squareSize/2); // 18
      pop();
    },
    function() {
      push();
      drawingContext.setLineDash(lineDashes);
      line(0, 0, squareSize, squareSize); // 19
      pop();
    },
    function() {
      push();
      drawingContext.setLineDash(lineDashes);
      line(0, squareSize, squareSize, 0); // 20
      pop();
    }
  ];
}

let squaresPerRow;

function reset() {
  squaresPerRow = random([3, 4, 5]);
  squareSize = width / squaresPerRow;
  lineDashes = [utils.relSize(20), utils.relSize(10)]

}


function draw() {
  background(utils.penColor);
  noFill();
  strokeWeight(utils.relSize(2));
  stroke(utils.paperColor);  
  utils.zoomOut(0.9);

  let oneIndex = Math.floor(random(drawFunctions.length));
  let twoIndex = Math.floor(random(drawFunctions.length));

  for (let x = 0; x < squaresPerRow; x++) {
    for (let y = 0; y < squaresPerRow; y++) {
      if(twoIndex == oneIndex) {
        twoIndex += 1;
        if(twoIndex == drawFunctions.length) {
          twoIndex = 1;
          oneIndex = 0;
        }
      }

      push();
      translate(squareSize*x, squareSize*y);

      drawFunctions[oneIndex]();
      drawFunctions[twoIndex]();

      twoIndex += 1;
      if(twoIndex == drawFunctions.length) {
        twoIndex = 0;
        oneIndex += 1;
        if(oneIndex == drawFunctions.length) {
          oneIndex = 0;
        }
      }

      pop();      
    }    
  }

}


const pieceName = "Wall Drawing";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
