import p5 from 'p5';
import * as utils from '../../utils';

const pieceName = "Genuary day 19: Text/typography";
let allColors = [
  '#333745','#e63462','#fe5f55','#c7efcf','#eef5db','#adb6c4','#ffefd3','#49beaa','#818D92'
]
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
let fonts;

function preload() {
  let fontNames = [
    'giant.ttf', 'handc.ttf', 'love.ttf', 'awake.ttf', 'cubic.ttf',
    'letterm.ttf','cafe.ttf','learners.ttf','signal.otf', 'vampire.otf'
  ];
  fonts = fontNames.map((n) => {
    return loadFont('/fonts/' + n);
  })
}

let loremArray;

function setup() {  
  utils.standardCanvas();
  allColors = allColors.map((c) => color(c).toString());
  loremArray = lorem.toUpperCase().split(" ");
  background(utils.paperColor);

  reset();
}

let colors = [];

function addAColor() {
  let unselecteds = allColors.filter((candidate) => {
    return !(colors.map((c) => c.c.toString()).includes(candidate))
  })

  colors.push({
    x: random(-width/5, width/5) + (random([0, width])),
    y: random(-height/5, height/5) + (random([0, height])),
    c: color(random(unselecteds))
  });
}

function reset() {
  frameRate(24);
  colors = [];
  for (let index = 0; index < 4; index++) {
    addAColor();
  }
}

function gatherTextByWord(arrayOfWords, x, w) {
  textSize(utils.relSize(55));
  
  let pointer = x;
  let rows = [];
  let currentRow = [];  

  for (let index = 0; index < arrayOfWords.length; index++) {
    let currentFont = random(fonts);
    const word = arrayOfWords[index];
    const wordBox = currentFont.textBounds(word, pointer.x, pointer.y);    

    if((pointer + wordBox.w) > w) {
      pointer = x;
      rows.push(currentRow);
      currentRow = [];
      index -= 1;
    } else {
      let newWord = {
        word,
        w: wordBox.w,
        h: wordBox.h,
        end: pointer + wordBox.w,
        font: currentFont
      }
      currentRow.push(newWord);
      pointer += wordBox.w;
    }
  }
  rows.push(currentRow);

  return rows;
}

function getColorFrom(x, y) {  
  let distances = colors.map((c) => {
    return {
      c: c.c,
      d: dist(x, y + (noise(x) * 100), c.x, c.y)
    }
  });

  distances.sort((a, b) => a.d - b.d);

  let c1 = distances[0];
  let c2 = distances[1];
  
  let result = [
    lerp(c1.c.levels[0], c2.c.levels[0], (c1.d/c2.d) + sin(frameCount)/10),
    lerp(c1.c.levels[1], c2.c.levels[1], (c1.d/c2.d) + sin(frameCount)/10),
    lerp(c1.c.levels[2], c2.c.levels[2], (c1.d/c2.d) + sin(frameCount)/10)
  ];

  return result;
}


function drawRow(row, rowY) {

  let xPointer = 0;
  const rowHeight = Math.max(...row.map((r) => r.h));
  const amountFilled = row.map((w) => w.w).reduce((a, b) => a+b);

  const gapBetween = (width - amountFilled) / (row.length - 1);

  for (let index = 0; index < row.length; index++) {
    const wordObj = row[index];
    let wordY = (rowHeight - wordObj.h)/1.8;
    let x = xPointer;
    let y = rowY + rowHeight - wordY;

    fill(getColorFrom(x, y));
    textFont(wordObj.font);
    text(wordObj.word, x, y);
    xPointer += wordObj.w;
    xPointer += gapBetween;
  }

  return rowHeight;
}

function draw() {
  translate(width/2, height/2);
  applyMatrix(utils.getMatrix(0.02));
  translate(-width/2, -height/2);
  utils.zoomOut(0.8);
  let rs = gatherTextByWord(loremArray, 0, width);
  const rowHeights = rs.map((r) => {
    return Math.max(...r.map((word) => word.h));
  });
  const totalHeight = rowHeights.reduce((a, b) => a+b);
  let diff = (height - totalHeight) / (rs.length);
  let y = diff;

  rs.map((r) => {
    y += drawRow(r, y);
    y += diff;
  });
  if(frameCount % 90 == 1) {
    colors.shift();
  }
  if(frameCount % 90 == 40) {
    addAColor();
  }

}

utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  