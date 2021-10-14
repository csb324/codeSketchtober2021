import * as utils from './index';

const PHASES = ['SCAFFOLDING', 'BUILDING', 'DESCAFFOLDING', 'WAITING', 'SCAFFOLDING', 'DEMOLISHING', 'DESCAFFOLDING'];
const BUILDING_TYPES = ['SCI_LI', 'GRAD_CENTER', 'CARRIE_TOWER']

let buildingColor;

export default class Building {
  constructor(x) {
    this.phaseIndex = floor(random(PHASES.length));
    this.setStartingValues();
    buildingColor = lerpColor(color(utils.paperColor), color(utils.penColor), 0.1);
    this.x = x;
    this.width = randomGaussian(utils.relSize(180), utils.relSize(50));
    this.setBuildingProps();
    this.seed = random(10000);
  }

  setBuildingProps() {
    this.height = utils.relSize(random(300, 900));
    this.numScaffolds = floor(random(2, 5));
    this.scaffoldHeight = utils.relSize(random(20, 60));
    this.buildTime = random(40, 100);
    this.buildIncrement = 100 / this.buildTime;
    this.buildingType = random(BUILDING_TYPES);
  }

  phase() {
    return PHASES[this.phaseIndex];
  }

  setStartingValues() {
    this.percentScaffolded = 0;
    this.percentBuilt = 0;
    this.percentWaited = 0;

    switch (this.phaseIndex) {
      case 0: // scaffolding, pre build
      case 6: // descaffolding, post demolish
        this.percentScaffolded = random(100);
        break;
      case 1: // building
      case 5: // demolishing
        this.percentScaffolded = 100;
        this.percentBuilt = random(100);
        break;
      case 2: // descaffolding
      case 4: // rescaffolding
        this.percentScaffolded = random(100);
        this.percentBuilt = 100;
        break;
      case 3: // waiting
        this.percentBuilt = 100;
        this.percentWaited = random(100);
        break;
      default:
        console.log("PROBLEMS");
        break;
    }
  }

  incrementPhase(expression) {
    if(expression) {
      this.phaseIndex++;
      if(!this.phase()) {
        this.phaseIndex = 0;
        this.resetBuilding();
      }  
    }
  }

  incrementBuild() {
    this.percentBuilt += this.buildIncrement;
    this.incrementPhase(this.percentBuilt >= 100);
  };
  incrementScaffold() {
    this.percentScaffolded += this.buildIncrement;
    if(random() > 0.3 && this.percentBuilt < this.percentScaffolded) {
      this.percentBuilt += this.buildIncrement;
    }
    this.incrementPhase(this.percentScaffolded >= 100);
  };

  incrementWait() {
    this.percentWaited += this.buildIncrement;
    this.incrementPhase(this.percentWaited >= 100);
  };

  decrementBuild() {
    this.percentBuilt -= this.buildIncrement;
    if(random() > 0.6 && this.percentBuilt < this.percentScaffolded) {
      this.percentScaffolded -= this.buildIncrement;
    }
    this.incrementPhase(this.percentBuilt <= 0);
  };
  decrementScaffold() {
    this.percentScaffolded -= 3*this.buildIncrement;
    this.incrementPhase(this.percentScaffolded <= 0);
  };

  addProgress() {
    switch (this.phase()) {
      case 'SCAFFOLDING':
        this.incrementScaffold();
        break;
      case 'DESCAFFOLDING':
        this.decrementScaffold();
        break;
      case 'BUILDING':
        this.incrementBuild();
        break;
      case 'DEMOLISHING':
        this.decrementBuild();
        break;
      case 'WAITING':
        this.incrementWait();
        break;

      default:
        console.log("quois??");
        console.log(this.phase())
        break;
    }
  
  }

  drawBuilding() {
    push();
    translate(this.x, 0);
    fill(buildingColor);
    noStroke();
    const currentHeight = max(this.height * this.percentBuilt, 0) / 100;
    switch (this.buildingType) {
      case 'SCI_LI':
        rect(0, height, this.width, -currentHeight); 
        stroke(utils.penColor);
        rect(utils.relSize(20), height - utils.relSize(20), this.width - utils.relSize(40),-(min(currentHeight - utils.relSize(20), this.height - utils.relSize(40) )));
        break;

      case 'CARRIE_TOWER':
        const towerHeight = this.height - this.width;
        let clockHeight = currentHeight - towerHeight;
        clockHeight = min(clockHeight, this.width - utils.relSize(40));

        if(clockHeight > 0) {
          rect(0, height, this.width, -towerHeight);
          rect(utils.relSize(20), height - towerHeight, this.width - utils.relSize(40), -clockHeight)
          stroke(utils.penColor);
          line(utils.relSize(20), height - towerHeight, this.width - utils.relSize(20), height - towerHeight);
        } else {
          rect(0, height, this.width, -currentHeight);
        }
        break;

      default:
        rect(0, height, this.width, -currentHeight);        
        break;
    }

    pop();

  }

  drawScaffolding() {
    randomSeed(this.seed); // save positions of benches etc
    push();
    const sPadding = utils.relSize(20);
    translate(this.x - sPadding/2, 0);
    const realWidth = this.width + sPadding;
    const currentHeight = max((this.height * this.percentScaffolded), 0) / 100;


    for (let i = height; i > (height - currentHeight); i-= this.scaffoldHeight) { 
      push();

      line(0, i - this.scaffoldHeight, realWidth, i - this.scaffoldHeight);
      for (let j = 0; j <= this.numScaffolds; j++) {
        line(j * realWidth / this.numScaffolds, i, j * realWidth/this.numScaffolds, i - this.scaffoldHeight);          
        if(j < this.numScaffolds) {
          line(j * realWidth / this.numScaffolds, i, (j+1) * realWidth / this.numScaffolds, i - this.scaffoldHeight);
          line(j * realWidth / this.numScaffolds, i - this.scaffoldHeight, (j+1) * realWidth / this.numScaffolds, i);
        }
      }
      if(random() > 0.8) {
        const boxHeight = utils.relSize(random(3, 10));
        const boxWidth = boxHeight * random(1.3, 5);
        const x = random(0, realWidth - boxWidth);
        noFill();
        rect(x, i - boxHeight, boxWidth, boxHeight);
        fill(utils.penColor);
        rect(x, i - boxHeight, boxWidth, boxHeight / 3);
      }

      pop();
    }
    pop();
    randomSeed(frameCount * this.percentScaffolded); // go back to random behavior
  }

  resetBuilding() {
    this.setBuildingProps();
    this.percentWaited = 0;
  }
}
