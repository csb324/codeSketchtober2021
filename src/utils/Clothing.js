import utils from ".";

let clothingPadding;
let lineDashes;

export class Clothing {
  constructor(w, h, double) {
    this.w = w;
    this.h = h;
    this.double = double;

    if (!clothingPadding) {
      clothingPadding = utils.relSize(5);
      lineDashes = [utils.relSize(3), utils.relSize(6)];
    }
  }

  drawSymmetrical() {
    this.drawOutline();
    translate(this.w/2, 0);
    scale(-1, 1); // flip
    translate(-this.w/2, 0);
    this.drawOutline();
  }



  pointsByRatio() {
    let lines = [];

    let lastWasEOL = true;
    for (let y = 0; y < 1; y+= (utils.relSize(10)/this.h)) {
      let EOL = random([false, false, false, false, true])


      lines.push([
        {x: lastWasEOL ? 0.1 : 0, y: y}, {x: EOL ? random(0.2, 1) : 1, y: y}
      ])

      lastWasEOL = EOL;

    }

    return lines;
  }

  drawVertex(p) {
    const x = map(p.x, 0, 1, clothingPadding, this.w - clothingPadding);
    const y = map(p.y, 0, 1, clothingPadding, this.h - clothingPadding);
    vertex(x, y);
  }

  drawCurveVertex(p) {
    const x = map(p.x, 0, 1, clothingPadding, this.w - clothingPadding);
    const y = map(p.y, 0, 1, clothingPadding, this.h - clothingPadding);
    curveVertex(x, y);
  }
  drawOutline() {
    this.pointsByRatio().forEach((listOfPoints) => {
      beginShape();
      listOfPoints.forEach((p) => {
        this.drawVertex(p);
      })
      endShape();
    })
  }

  drawOnce() {
    this.drawOutline();
  }

  draw() {
    this.drawOnce();
    if(this.double.x) {
      translate(this.w, 0);
      this.drawOnce();
    }
    if(this.double.y) {
      translate(0, this.h);
      this.drawOnce();
    }
  }
}

export class Shoes extends Clothing {
  pointsByRatio() {
    const laceMargin = 0.1;
    return [
      [{
        x: laceMargin, y: 0.5 
      }, {
        x: 0.5 - laceMargin, y: 0.5
      }],
      [{
        x: laceMargin, y: 0.4 
      }, {
        x: 0.5 - laceMargin, y: 0.4
      }],
      [{
        x: laceMargin, y: 0.3
      }, {
        x: 0.5 - laceMargin, y: 0.3
      }]
    ];
  } 

  drawShoe() {

    const shoePoints = [
        {
            "x": 0.11,
            "y": 0.03
        },
        {
            "x": 0.03,
            "y": 0.11
        },
        {
            "x": 0.07,
            "y": 0.79
        },
        {
            "x": 0.13,
            "y": 0.95
        },
        {
            "x": 0.26,
            "y": 0.95
        },
        {
            "x": 0.38,
            "y": 0.81
        },
        {
            "x": 0.46,
            "y": 0.28
        },
        {
            "x": 0.43,
            "y": 0.11
        },
        {
            "x": 0.28,
            "y": 0.02
        },
        {
            "x": 0.11,
            "y": 0.03
        }
    ];

    const holePoints = [
      {
        x: 0.16, y: 0.6
      },

      {
        "x": 0.12,
        "y": 0.7
      },
      {
          "x": 0.16,
          "y": 0.9
      },
      {
          "x": 0.26,
          "y": 0.9
      },
      {
          "x": 0.31,
          "y": 0.7
      },
      {
        x: 0.26, y: 0.6
      },
      {
        x: 0.16, y: 0.6
      }
    ]

    beginShape();
    curveTightness(0.6);
    this.drawVertex(shoePoints[0]); // toe
    shoePoints.forEach((sp) => {
      this.drawCurveVertex(sp);
    })
    this.drawCurveVertex(shoePoints[0]); 
    endShape();


    beginShape();
    this.drawVertex(holePoints[0]); // toe
    holePoints.forEach((sp) => {
      this.drawCurveVertex(sp);
    })
    this.drawCurveVertex(holePoints[0]); 
    endShape();

  }

  drawOnce() {
    push();

    translate(this.w / 2, 0);
    this.drawShoe();
    super.drawOnce();
    scale(-1, 1); // flip
    super.drawOnce();
    this.drawShoe();

    pop();
  }
};

export class Pants extends Clothing {
  constructor(...args) {
    super(...args);
    this.belted = random([true, false]);
    this.pockets = random([true, false]);
  }

  pointsByRatio() {
    const rise = 0.2;
    const waist = 0.8/2;
    const ankle = random(0.2, 0.4);

    return [
      [
        {x: 0.5 - waist, y: 0},
        {x: 0.5 + waist, y: 0},
        {x: 1, y: 1},
        {x: 1 - ankle, y: 1},
        {x: 0.5, y: rise},
        {x: ankle, y: 1},
        {x: 0, y: 1},
        {x: 0.5 - waist, y: 0}
      ]
    ]
  }

  drawOnce() {
    const waist = 0.8/2;

    super.drawOutline();
    if(this.belted) {
      let buttonX = map(0.55, 0, 1, clothingPadding, this.w - clothingPadding);
      let buttonY = map(0.03, 0, 1, clothingPadding, this.h - clothingPadding);
      let buttonSize = map(0.02, 0, 1, clothingPadding, this.h - clothingPadding);

      ellipse(buttonX, buttonY, buttonSize);

      push();
      drawingContext.setLineDash(lineDashes);
      beginShape();
      this.drawVertex({x: 0.5 - waist, y: 0.06});
      this.drawVertex({x: 0.5 + waist, y: 0.06});
      endShape();
      beginShape();
      this.drawVertex({x: 0.5, y: 0.06});
      this.drawVertex({x: 0.5, y: 0.2});
      endShape();
      pop();
    }

    if(this.pockets) {
      const pocketStart = 0.25;
      const pocketY = 0.1;
      const pocketFactor = (0.5 - waist) * (1 - pocketY);

      beginShape();
      this.drawVertex({x: pocketFactor, y: pocketY});
      this.drawVertex({x: pocketStart, y: 0.06});
      endShape();

      beginShape();
      this.drawVertex({x: 1 - pocketFactor, y: pocketY});
      this.drawVertex({x: 1 - pocketStart, y: 0.06});
      endShape();
    }
  }
};

const neckline = 0.3;
export class Dress extends Clothing {

  constructor(...args) {
    super(...args);
    this.necklineFactor = random(0, 1);
    this.belted = random([true, false]);
  }

  pointsByRatio() {
    const shoulderWidth = 0.2;

    return [
      [
        {x: 0.5, y: neckline * this.necklineFactor},
        {x: shoulderWidth, y: 0},
        {x: shoulderWidth - 0.02, y: 0},

        {x: shoulderWidth - 0.05, y: 0.14},
        {x: shoulderWidth - 0.1, y: neckline},
        {x: shoulderWidth, y: neckline * 1.5},
        {x: 0, y: 1},
        {x: 1, y: 1},
      ]
    ]
  }

  drawOnce() {
    const shoulderWidth = 0.2;

    this.drawSymmetrical();
    push();
    if(this.belted) {
      drawingContext.setLineDash(lineDashes);
      beginShape();
      this.drawVertex({x: shoulderWidth, y: neckline * 1.5});
      this.drawVertex({x: 1 - shoulderWidth, y: neckline * 1.5});
      endShape();
    }
    pop();
  }
};

export class Shorts extends Pants {
  pointsByRatio() {
    const rise = 0.8;
    const waist = 0.8/2;
    const ankle = random(0.4, 0.5);

    return [
      [
        {x: 0.5 - waist, y: 0},
        {x: 0.5 + waist, y: 0},
        {x: 1, y: 1},
        {x: 1 - ankle, y: 1},
        {x: 0.5, y: rise},
        {x: ankle, y: 1},
        {x: 0, y: 1},
        {x: 0.5 - waist, y: 0}
      ]
    ]
  }

  drawOnce() {
    const waist = 0.8/2;

    super.drawOutline();
    if(this.belted) {
      let buttonX = map(0.55, 0, 1, clothingPadding, this.w - clothingPadding);
      let buttonY = map(0.06, 0, 1, clothingPadding, this.h - clothingPadding);
      let buttonSize = map(0.04, 0, 1, clothingPadding, this.h - clothingPadding);

      ellipse(buttonX, buttonY, buttonSize);

      push();
      drawingContext.setLineDash(lineDashes);
      beginShape();
      this.drawVertex({x: 0.5 - waist, y: 0.14});
      this.drawVertex({x: 0.5 + waist, y: 0.14});
      endShape();
      beginShape();
      this.drawVertex({x: 0.5, y: 0.14});
      this.drawVertex({x: 0.5, y: 0.8});
      endShape();
      pop();
    }

    if(this.pockets) {
      const pocketStart = 0.25;
      const pocketY = 0.3;

      const pocketFactor = (0.5 - waist) * (1 - pocketY);

      beginShape();
      this.drawVertex({x: pocketFactor, y: pocketY});
      this.drawVertex({x: pocketStart, y: 0.14});
      endShape();

      beginShape();
      this.drawVertex({x: 1 - pocketFactor, y: pocketY});
      this.drawVertex({x: 1 - pocketStart, y: 0.14});

      endShape();
      // pop();      
    }
  }

}

export class Underpants extends Clothing {

  pointsByRatio() {
    const band = 0.2;
    const crotch = 0.2 / 2;
    return [
      [
        { x: 0, y: band },
        { x: 0, y: 0},
        { x: 1, y: 0},
        { x: 1, y: band},
        {x: 0.5 + crotch, y: 1},
        {x: 0.5 - crotch, y: 1},
        { x: 0, y: band }
      ], [
        {x: 0, y: band * 0.5},
        {x: 1, y: band * 0.5}
      ]
    ]
  }
};

export class TShirt extends Clothing {
  constructor(...args) {
    super(...args);
    this.shirtWidth = 0.66 / 2;
    this.collarWidth = random(0.23, 0.15);
    this.shoulderWidth = 0.23;
    this.sleeveHeight = 0.42;

    this.decor = random(['pocket', 'stripe', false, false]);

  }
  pointsByRatio() {
    
    return [      
      [
        {x: this.collarWidth, y: 0},
        {x: this.shoulderWidth, y: 0},
        {x: 0.5, y: 0.1},
        {x: 0.48, y: this.sleeveHeight},
        {x: this.shirtWidth, y: this.sleeveHeight * 0.9},
        {x: this.shirtWidth, y: 1},
        {x: -this.shirtWidth, y: 1},
        
        {x: -this.shirtWidth, y: this.sleeveHeight * 0.9},
        {x: -0.48, y: this.sleeveHeight},
        {x: -0.5, y: 0.1},
        {x: -this.shoulderWidth, y: 0},
        {x: -this.collarWidth, y: 0}
      ]  
    ];
  }

  drawOnce() {    
    push();
    translate(this.w / 2, 0);
    super.drawOnce();

    beginShape();
    this.drawVertex({x: -this.collarWidth, y: 0});
    this.drawVertex({x: -this.collarWidth, y: 0});
    this.drawCurveVertex({x: 0, y: 0.1});
    this.drawVertex({x: this.collarWidth, y: 0});
    this.drawVertex({x: this.collarWidth, y: 0});
    endShape();

    if(random() > 0.5) {
      drawingContext.setLineDash(lineDashes);

      beginShape();
      this.drawVertex({x: -this.collarWidth*1.1, y: 0.02});
      this.drawVertex({x: -this.collarWidth*1.1, y: 0.02});
      this.drawCurveVertex({x: 0, y: 0.13});
      this.drawVertex({x: this.collarWidth*1.1, y: 0.02});
      this.drawVertex({x: this.collarWidth*1.1, y: 0.02});
      endShape();
  
    }

    if(this.decor == 'pocket') {
      drawingContext.setLineDash(lineDashes);
      beginShape();
      this.drawVertex({x: this.shoulderWidth, y: this.sleeveHeight/2});
      this.drawVertex({x: this.shoulderWidth, y: this.sleeveHeight});
      this.drawVertex({x: this.collarWidth/2, y: this.sleeveHeight});
      this.drawVertex({x: this.collarWidth/2, y: this.sleeveHeight/2});
      this.drawVertex({x: this.shoulderWidth, y: this.sleeveHeight/2});

      endShape();
    }

    if (this.decor == 'stripe') {
      for (let index = 0; index < 3; index++) {
        drawingContext.setLineDash([1]);

        beginShape();
        this.drawVertex({x: this.shirtWidth, y: this.sleeveHeight + (0.1 * index)});
        this.drawVertex({x: -this.shirtWidth, y: this.sleeveHeight + (0.1 * index)});
        endShape();
      }
    }

    pop();    

  }
};

export class ButtonDown extends Clothing {
  pointsByRatio() {
    return [
      [
        {
            "x": 0.5,
            "y": 0
        },
        {
            "x": 0.44,
            "y": 0.02
        },
        {
            "x": 0.44,
            "y": 0.08
        },
        {
            "x": 0.02,
            "y": 0.24
        },
        {
            "x": 0.04,
            "y": 0.38
        },
        {
            "x": 0.34,
            "y": 0.3
        },
        {
            "x": 0.32,
            "y": 0.9
        },
        {
            "x": 0.45,
            "y": 1
        },
        {
            "x": 0.5,
            "y": 0.9
        },
        {
            "x": 0.5,
            "y": 0.11
        },
        {
            "x": 0.49,
            "y": 0.15
        },
        {
            "x": 0.44,
            "y": 0.08
        },
        {
            "x": 0.44,
            "y": 0.01
        },
        {
            "x": 0.5,
            "y": 0.09
        }
      ]
    ]
  }

  drawOnce() {
    push();
    this.drawSymmetrical();
    pop();
  }
};

export class Necklace extends Clothing {

  constructor(...args) {
    super(...args);
    this.collarWidth = random(0.23, 0.15);
  }

  drawVertex(p) {
    const cp = utils.relSize(6);
    const x = map(p.x, 0, 1, cp, this.w - cp);
    const y = map(p.y, 0, 1, cp, this.h - cp);
    vertex(x, y);
  }

  drawCurveVertex(p) {
    const cp = utils.relSize(6);

    const x = map(p.x, 0, 1, cp, this.w - cp);
    const y = map(p.y, 0, 1, cp, this.h - cp);
    curveVertex(x, y);
  }

  pointsByRatio() {
    return [
      [
        {x: 0, y: this.collarWidth},
        {x: 0.5, y: 0.9},
        {x: 1, y: this.collarWidth}
      ]
    ]
  }
  drawOnce() {
    // super.drawOnce();
    curveTightness(0.2);
    const charmWidth = 0.09;

    beginShape();
    this.drawVertex({x: 0.5, y: 0.9})
    this.drawVertex({x: 0.5, y: 0.9})
    this.drawCurveVertex({x: 0, y: 2 * this.collarWidth});
    this.drawCurveVertex({x: 0, y: this.collarWidth});
    this.drawCurveVertex({x: 0.3, y: 0.05});
    this.drawCurveVertex({x: 0.7, y: 0.05});    
    this.drawCurveVertex({x: 1, y: this.collarWidth});
    this.drawCurveVertex({x: 1, y: 2 * this.collarWidth});
    this.drawVertex({x: 0.5, y: 0.9})
    this.drawVertex({x: 0.5, y: 0.9})
    endShape();

    beginShape();
    this.drawVertex({x: 0.5, y: 0.9})
    this.drawVertex({x: 0.5 + charmWidth, y: 0.95});
    this.drawVertex({x: 0.5, y: 1})
    this.drawVertex({x: 0.5 - charmWidth, y: 0.95});
    this.drawVertex({x: 0.5, y: 0.9})

    endShape();

  }
}
