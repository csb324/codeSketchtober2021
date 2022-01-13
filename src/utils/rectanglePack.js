import utils from './index';

export default function pack(subsegments, minDimension, square = false) {
  if(square) {
    return squarePack(subsegments, minDimension);
  }

  let oldSubsegments = [];
  let i = 0;
  while(oldSubsegments.length !== subsegments.length) {
    oldSubsegments = subsegments;
    subsegments = rectanglePack(subsegments, i, minDimension);
    i++;
  }
  return subsegments;
}

function squarePack(subsegments, minDimension) {
  let oldSubsegments = [];
  let i = 0;
  while(oldSubsegments.length !== subsegments.length) {
    oldSubsegments = subsegments;
    subsegments = _squarePack(subsegments, i, minDimension);
    i++;
  }
  return subsegments;
}

function _squarePack(subsegments, i, minDimension) {
  let newSubsegments = [];
  for (let index = 0; index < subsegments.length; index++) {
    const element = subsegments[index];

    const bigEnoughToSplit = (element.w > 2*minDimension);

    if (random() > 0.6 || !(bigEnoughToSplit)) {
      newSubsegments.push(element);
    } else {
      let f = random([2, 2, 3]);
      let newW = element.w / f;
      for (let x = 0; x < f; x++) {
        for (let y = 0; y < f; y++) {
          let newElement = {
            x: element.x + x*newW,
            y: element.y + y*newW,
            h: newW,
            w: newW
          }
          subsegments.push(newElement);          
        }        
      }
    }
  }
  return newSubsegments;
}

function rectanglePack(subsegments, i, minDimension) {
  let newSubsegments = [];
  for (let index = 0; index < subsegments.length; index++) {
    const element = subsegments[index];

    const wideEnoughToSplit = (element.w > 2*minDimension);
    const tallEnoughToSplit = (element.h > 2*minDimension);

    if (random() < (i/10) || !(wideEnoughToSplit || tallEnoughToSplit)) {
      newSubsegments.push(element);
    } else if (wideEnoughToSplit || tallEnoughToSplit) {      
      if(element.w > element.h) {
        const divisionPoint = random(minDimension, element.w - minDimension);
        const newPoint = {
          x: element.x + divisionPoint, 
          y: element.y, 
          w: element.w - divisionPoint, 
          h: element.h
        }
        newSubsegments.push(newPoint);
        element.w = divisionPoint;
        newSubsegments.push(element);

      } else {
        const divisionPoint = random(minDimension, element.h - minDimension);
        const newPoint = {
          x: element.x, 
          y: element.y  + divisionPoint, 
          w: element.w, 
          h: element.h - divisionPoint
        }
        newSubsegments.push(newPoint);
        element.h = divisionPoint;
        newSubsegments.push(element);

      }  
    }


  }
  return newSubsegments;
}