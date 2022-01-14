
class Braid {
  constructor(cs) {
    // utils.shuffleArray(cs);
    this.central = Math.floor(cs.length/2);
    this.strings = cs.map((c, i) => {
      return {
        color: c,
        index: i,
        lastPosition: {
          x: 0,
          y: height/2
        }
      }
    });

    // this.strings.slice(1,3).forEach((s) => s.lastPosition.x += xIncrement);
    // this.strings.slice(2,4).forEach((s) => s.lastPosition.x += xIncrement);
    // this.strings[3].lastPosition.x += xIncrement;

    this.x = 0;
    this.h = height;
    this.toggle = false;
    this.alternatePattern = (this.strings.length == 5) ? 0 : 1;
  }

  braidArray() {
    let last;
    if(this.toggle) {
      last = this.strings.pop();
    } else {
      last = this.strings.shift();
    }

    // last.lastPosition.x += xIncrement
    this.strings.splice(this.central, 0, last);

    this.toggle = !this.toggle;
  }

  drawString(string, index) {
    string.newPosition = {
      x: string.lastPosition.x + xIncrement, 
      y: index * 10 + (random(4, 6))
    };
    stroke(string.color);
    line(string.lastPosition.x, string.lastPosition.y, string.newPosition.x, string.newPosition.y);      

  }

  step() {
    this.x += xIncrement;
    this.braidArray();

    const orderToDraw = [0, 6, 2, 4, 3, 1, 5];

    orderToDraw.forEach((i) => {
      const string = this.strings[i];
      this.drawString(string, i);
      this.drawString(string, i);
    })
    
    this.strings.forEach((s) => s.lastPosition = s.newPosition);

  }

  end(isFinished) {

    this.x += xIncrement;
    this.braidArray();

    this.strings.forEach((string, i) => {
      if(isFinished) {
        string.newPosition = {x: 800, y: (height/2)};
      } else {
        string.newPosition = {x: 800, y: (height/this.strings.length) * i};
      }

      if((i%2 == 0) == this.toggle) {
        stroke(string.color);
        line(string.lastPosition.x, string.lastPosition.y, string.newPosition.x, string.newPosition.y);      
      }
    });

    this.strings.forEach((string, i) => {
      if((i%2 == 1) == this.toggle) {
        stroke(string.color);
        line(string.lastPosition.x, string.lastPosition.y, string.newPosition.x, string.newPosition.y);      
      }
    });
    this.strings.forEach((s) => s.lastPosition = s.newPosition);
  }

  draw() {
    background(utils.penColor);
    // strokeCap(SQUARE);
    strokeWeight(9);
    let i = 0;
    while(this.x < 800-xIncrement && i < t) {
      this.step();
      i += 1;
    }
    this.end( this.x >= 800-xIncrement );

    if(this.x >= 800-xIncrement) {
      noLoop();
    }
  }
}


class Braid2 {
  constructor(cs) {
    this.central = Math.floor(cs.length/2);
    this.strings = cs.map((c, i) => {
      return {
        color: c,
        index: i,
        lastPosition: {
          x: 0,
          y: height/2
        }
      }
    });
    this.x = 0;
    this.h = height;
    this.toggle = false;

    this.columns = [[false], [], [], [false]];
  }


  braidArray() {
    console.log("braiding");
    let last;
    if(this.toggle) {
      last = this.strings.pop();
      this.strings.splice(this.central, 0, last);
      this.columns[3].push(last.color);
      this.columns[2].push(this.strings[this.strings.length - 2].color);
      this.columns[1].push(false);

    } else {
      last = this.strings.shift();
      this.strings.splice(this.central, 0, last);
      this.columns[0].push(last.color);
      this.columns[1].push(this.strings[1].color);
      
    }

    this.toggle = !this.toggle;
  }

  draw() {
    const iterations = 20;

    for (let index = 0; index < iterations*2; index++) {
      this.braidArray();      
    }
    console.log(this.columns);

    this.columns.forEach((col, index) => {
      let y = index * 20;
      col.forEach((c, stepNo) => {
        let x = stepNo * (800/iterations);
        if(c) {
          fill(c);
          rect(x, y, 800/iterations, 20);  
        }
      }) 
    })
  }


}
