export function standardCanvas(options = {}) {
  const parent = document.getElementById('canvas-parent');
  let smallerDimension = Math.min(parent.parentElement.offsetWidth, parent.parentElement.offsetHeight)
  smallerDimension -= 32;

  const c = createCanvas(smallerDimension, smallerDimension, options.renderer || P2D);
  c.parent('canvas-parent');
  return c;
}

export function standardGraphics(options = {}) {
  const parent = document.getElementById('canvas-parent');
  let smallerDimension = Math.min(parent.parentElement.offsetWidth, parent.parentElement.offsetHeight)
  smallerDimension -= 32;

  const c = createGraphics(smallerDimension, smallerDimension, options.renderer || P2D);
  c._accessibleOutputs = {}; // this is because of a bug.
  if(options.renderer == WEBGL) {
    c.translate(-width/2, -height/2);

  }
  c.parent('canvas-parent');
  return c;
}

export const penColor = '#111111';
export const paperColor = '#efefef';

export function rgba(r, g, b, aPercent) {
  return color(r, g, b, aPercent * 255);
}


export function createGradient(color1, color2, xDirection, yDirection) {
  const g = drawingContext.createLinearGradient(0, 0, xDirection ? width*xDirection : 0, yDirection ? height*yDirection : 0);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  return g;
}

export function createRadialGradient(colors, circleSize, offsetX = 0, offsetY = 0) {
  const g = drawingContext.createRadialGradient(0, 0, 0, offsetX, offsetY, circleSize);
  for (let index = 0; index < colors.length; index++) {
    const element = colors[index];
    g.addColorStop((index/colors.length), element);    
  }
  return g;
}

export function shuffleArray(array) { 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function debugShape(pointsArray) {
  for (let index = 0; index < pointsArray.length; index++) {
    const p = pointsArray[index];
    ellipse(p.x, p.y, 10, 10);
  }
}

// these are just defaults I use -- you can kill this if you don't want it
export function standardKeyPressed() {
  if(frameStandard > 100) {
    frameStandard = floor(frameRate());
  }
  if (key === "s") {		
    save()
  }
  if (key === "p") {
    frameRate(isPaused ? frameStandard : 0);
    isPaused = !isPaused;
    console.log(isPaused);
    console.log(frameStandard);
  } 
}

export function standardKeyPressedFactory(name) {
  let isPaused = false;
  let frameStandard = 300;
  function standardKeyPressed() {
    if(frameStandard > 100) {
      frameStandard = floor(frameRate());
    }
    if (key === "s") {		
      save(name)
    }
    if (key === "p") {
      frameRate(isPaused ? frameStandard : 0);
      isPaused = !isPaused;
      console.log(isPaused);
      console.log(frameStandard);
    } 
  }

  return standardKeyPressed;
  
}


let lapse = 0;
// this prevents accidental double-clicks on touch devices
// it's handy, if you want it. but you can also change what it does
export function standardMouseReleasedFactory(resetFunction){
  return function(event) {
    if(event.target.className == "p5Canvas") {
      if (millis() - lapse > 200){
        noiseSeed(random(1000));
        resetFunction();
        redraw();
      }
      lapse = millis();
      return false;  
  
    }
  }
}

export function getMatrix(matrixVariation) {
  return [ // a very slightly messed up identity matrix 
		1 + random(-matrixVariation, matrixVariation), 
				random(-matrixVariation, matrixVariation), 
				random(-matrixVariation, matrixVariation),
		1 + random(-matrixVariation, matrixVariation), 
				random(-matrixVariation, matrixVariation),
				random(-matrixVariation, matrixVariation)
	];
}

export function zoomOut(amount) {
  translate(width/2, height/2);
  scale(amount, amount);
  translate(-width/2, -height/2);
}

export function relSize(pixelsIsh) {
  return (pixelsIsh/1000) * width;
}

export function attach(options = {}) {
  window.setup = options.setup;
  window.draw = options.draw;
  window.preload = options.preload;
  window.keyPressed = options.keyPressed;
  window.mouseClicked = options.mouseClicked;
  window.mouseReleased = options.mouseReleased;
} // these are the p5 events I use most so, here they are

export default {
  attach,
  relSize,
  zoomOut, 
  getMatrix,
  standardMouseReleasedFactory,
  standardKeyPressed,
  standardCanvas,
  debugShape,
  shuffleArray,
  createRadialGradient,
  createGradient,
  penColor,
  paperColor,
  rgba
};