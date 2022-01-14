function wiggleLine(x1, y1, x2, y2, endVariation = true, stepsFactor = 1) {
  const steps = random(5, 10) * stepsFactor;
  const delta = createVector(x2-x1, y2-y1);
  delta.mult(1/steps);
  const variation = delta.mag() * 0.1;

  let startX = x1;
  let startY = y1;
  let endX = x2;
  let endY = y2;

  if(endVariation) {
    startX += random(-variation, variation);
    startY += random(-variation, variation);
    endX += random(-variation, variation);
    endY += random(-variation, variation);
  }

  beginShape();

  vertex(startX, startY);
  vertex(startX, startY);

  for (let index = 1; index < (steps-1); index++) {
    curveVertex(
      x1 + (index * delta.x) + random(-variation, variation),
      y1 + (index * delta.y) + random(-variation, variation)
    );
  }
  vertex(endX, endY);
  vertex(endX, endY);


  endShape();
}
export default wiggleLine;