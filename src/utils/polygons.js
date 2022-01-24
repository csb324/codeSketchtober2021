export function drawHex(x, y, radius, options = {}) {
  drawPolygon(x, y, radius, 6, options);
}
export function drawTriangle(x, y, radius, options = {}) {
  drawPolygon(x, y, radius, 3, options);
}
export function drawPentagon(x, y, radius, options = {}) {
  drawPolygon(x, y, radius, 5, options);
}

export function drawPolygon(centerX, centerY, radius, n, options = {}) {
  push();
  translate(centerX, centerY);
  if(options.randomRotation) {
    rotate(random(TWO_PI));
  } else if (options.angle) {
    rotate(options.angle);
  }

  let pointer = createVector(radius, 0);
  beginShape();
  for (let a = 0; a <= TWO_PI; a += (TWO_PI / n)) {
    pointer.setHeading(a);
    vertex(pointer.x, pointer.y);
  }
  endShape(CLOSE);

  pop();
}
