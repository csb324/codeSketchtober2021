export function standardCanvas(options = {}) {
  const parent = document.getElementById('canvas-parent');
  let smallerDimension = Math.min(parent.parentElement.offsetWidth, parent.parentElement.offsetHeight)
  smallerDimension -= 32;

  const c = createCanvas(smallerDimension, smallerDimension, options.renderer || P2D);
  c.parent('canvas-parent');
}



export function shuffleArray(array) { 
	// we're gonna shuffle the colors so cyan isn't always 
	// in the back
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// these are just defaults I use -- you can kill this if you don't want it
let isPaused = false;
let frameStandard = 300;
export function standardKeyPressed() {
  if(frameStandard > 30) {
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


let lapse = 0;
// this prevents accidental double-clicks on touch devices
// it's handy, if you want it. but you can also change what it does
export function standardMouseReleasedFactory(resetFunction){
  return function() {
    if (millis() - lapse > 200){
      clear();
      noiseSeed(random(1000));
      resetFunction();
      redraw();
    }
    lapse = millis();
    return false;  
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

export function relSize(pixelsIsh) {
  return (pixelsIsh/1000) * width;
}

export function attach(options = {}) {
  window.setup = options.setup;
  window.draw = options.draw;
  window.keyPressed = options.keyPressed;
  window.mouseClicked = options.mouseClicked;
  window.mouseReleased = options.mouseReleased;
} // these are the p5 events I use most so, here they are

