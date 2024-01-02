import p5 from 'p5';
import * as utils from '../../utils';

const pieceName = "Genuary day 22: Something that will look different in a year";
const WORDNIK_API_KEY = process.env.KEYS["WORDNIK_API_KEY"];

let wordData;
let factData;
const backupWords = [
  {"_id":"600315a842e9fe73830d6dc8","word":"windslab","contentProvider":{"name":"wordnik","id":711},"definitions":[{"source":"wiktionary","text":"Snow which peels off in large slabs when disturbed, increasing the risk of avalanche.","note":null,"partOfSpeech":"noun"}],"publishDate":"2021-01-26T03:00:00.000Z","examples":[{"url":"http://independent.co.uk/travel/uk/the-big-freeze-an-icecold-adventure-in-the-cairngorms-2204495.html","title":"The Independent - Frontpage RSS Feed","text":"Andy would occasionally pause to point out various different forms of frozen water: rime ice, hoar frost, frost heave, windslab snow.","id":472631063},{"url":"http://www.everestnews.com/stories2005/davelim02152005.htm","text":"Slightly convex, I had to don crampons again as the windslab was icy and there were many bulges of 50 degrees or more.","id":252145593},{"url":"http://www.backpacker.com/survival_outdoor_accidents_falling_fatalities/blogs/the_pulse/956","text":"This pair found deep windslab on top of a shiny, melted and re-frozen, surface of old snow .... classic conditions for a high-mountain ridgetop avalanche.","id":257315783},{"url":"http://www.bclocalnews.com/r?19=961&43=465487&44=41120949&32=4377&7=405959&40=http\\%3A\\%2F\\%2Fwww.bclocalnews.com\\%2Fkootenay_rockies\\%2Ftrailrosslandnews\\%2Flifestyles\\%2Fprovincial\\%2F41120949.html","title":"Kootenay Rockies - News","text":"If you find your skis riding on top of the surface of the snow and it sounds or feels hollow, you're probably on top on a hard windslab.","id":157797197}],"pdd":"2021-01-26","htmlExtra":null,"note":"The word 'windslab' is a compound of 'wind' and 'slab'."},
  {
    "_id": "61cfa6725aab1aaae77eab2e",
    "word": "surquedry",
    "contentProvider": {
      "name": "wordnik",
      "id": 711
    },
    "definitions": [
      {
        "source": "gcide",
        "text": "Overweening pride; arrogance; presumption; insolence.",
        "note": null,
        "partOfSpeech": "noun"
      }
    ],
    "publishDate": "2022-01-22T03:00:00.000Z",
    "examples": [
      {
        "url": "http://www.gutenberg.org/dirs/etext04/tbtrt10.txt",
        "title": "The Betrothed",
        "text": "What so reasonable as that we should be punished for our pride and contumacy, by a judgment specially calculated to abate and bend that spirit of surquedry?",
        "id": 1076696193
      }
    ],
    "pdd": "2022-01-22",
    "note": "The word 'surquedry' comes from an old French word meaning 'to overthink'.",
    "htmlExtra": null
  }
];

let f;

let wordBubbleSize;
let factBubbleSize;

const noteColors = ['#FCF5C7', '#D8E1FF'];
const accentColor = '#3C89CD';
const backgroundColors = [
  ['#93032e','#e3655b','#160c28'],
  ['#db3069','#3c3c3b','#169873'],
  ['#230903','#656256','#4b4237'],
  ['#515052','#000103','#333138'],
  ['#f95738','#104547','#0d1321'],
  ['#45b69c','#93032e','#84894a'],
  ['#E55934','#FA7921','#522A27'],
  ['#885a5a','#dc136c', '#353a47'],
  ['#F92A82', '#ED7B84',utils.penColor]
];

function getTodayString() {
  const today = new Date();
  let m = today.getMonth() + 1;
  m = m.toString().padStart(2, '0');

  let d = today.getDate().toString().padStart(2, '0');
  return `${today.getFullYear()}-${m}-${d}`;

}
function fetchWordData() {

  wordData = loadJSON(
    'https://api.wordnik.com/v4/words.json/wordOfTheDay?date=' + getTodayString() + '&api_key=' + WORDNIK_API_KEY,
    (response) => {
      localStorage.setItem('daily-word', JSON.stringify(response));
    }, (err) => {
      console.log(err);
      return random(backupWords);
    }
  );
}

function preload() {
  f = loadFont('/fonts/welbut.ttf');
  // let randomDay = Math.ceil(random(28))
  if(localStorage.getItem('daily-word')) {
    wordData = JSON.parse(localStorage.getItem('daily-word'));
    if(wordData.pdd !== getTodayString()) {
      console.log("no that was yesterday");
      console.log(wordData.pdd);
      console.log(getTodayString());
      fetchWordData();
    }
  } else {
    fetchWordData();
  }


  factData = loadJSON('https://uselessfacts.jsph.pl/today.json');

  // wordData = random(backupWords);
  // factData = [ {"q":"Worry is a waste of emotional reserve.","a":"Ayn Rand","h":"<blockquote>&ldquo;Worry is a waste of emotional reserve.&rdquo; &mdash; <footer>Ayn Rand</footer></blockquote>"} ]
}

function setup() {  
  utils.standardCanvas();
  // noLoop();
  frameRate(1);
  textFont(f);
  reset();
}

let bg;

function drawFrame() {
  stroke(utils.penColor);
  fill(utils.paperColor);
  beginShape();

  vertex(-width, -height);
  vertex(2*width, -height);
  vertex(2*width, 2*height);
  vertex(-width, 2*height);
  vertex(-width, -height);

  beginContour();
  vertex(0, 0);
  vertex(0, width);
  vertex(width, height);
  vertex(width, 0);
  endContour(CLOSE);
  endShape();
}

function reset() {
  bg = random(backgroundColors);
  utils.shuffleArray(bg);
  push();
  utils.zoomOut(0.8);
  strokeWeight(utils.relSize(10));  
  drawBackground()
  drawTaskBar();
  drawQuoteNotification();
  drawWordNotification();
  drawQuoteNotification();
  drawWordNotification();
  drawQuoteNotification(true);
  drawWordNotification(true);

  drawFrame();

  pop();
}

function getDate() {
  const d = new Date();

  return `${d.toDateString()}, ${d.toLocaleTimeString()}`;
}

const metaSize = 32;
const headingSize = 100;
const factSize = metaSize * 2;
const padding = 16;

function drawTaskBar() {

  const taskBarHeight = utils.relSize(60);
  fill(utils.paperColor);
  stroke(utils.penColor);
  strokeWeight(utils.relSize(10));
  rect(0, height, width, -taskBarHeight);

  push();

  const d = getDate();
  textAlign(RIGHT);
  noStroke();
  textSize(utils.relSize(metaSize));
  fill(utils.penColor);
  text(d, width - utils.relSize(padding*2), height - utils.relSize(padding));

  pop();
}

function getColor(x, y) {
  const cubeWidth = 12;
  if(Math.floor(y/cubeWidth) % 2) {
    x += cubeWidth/2;
  }

  let xTiled = x % cubeWidth;
  xTiled += 1;
  let yTiled = y % cubeWidth;

  if(xTiled <= 6) {
    if(xTiled < yTiled*2 && xTiled-1 > (yTiled - 9) * 2) {
      return bg[0];
    }
  } else {
    if((cubeWidth+1 - xTiled) < yTiled*2 && cubeWidth - xTiled > (yTiled - 9) * 2) {
      return bg[1];
    }
  }

  return bg[2];

}

function drawBackground() {
  background(utils.paperColor);

  let squareSize = utils.relSize(10);
  noStroke();

  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      fill(getColor(x, y));
      rect(x*squareSize, y*squareSize, squareSize+1);
    }
  }
}


function getWordBubbleSize() {
  if(wordBubbleSize) {
    return wordBubbleSize;
  }

  let bubbleWidth = 0;
  let bubbleHeight = utils.relSize(metaSize);

  textSize(utils.relSize(metaSize));
  const introWidth = f.textBounds("The word of the day is:", 0, 0).w;
  textSize(utils.relSize(headingSize + 5));
  const wordWidth = f.textBounds(wordData.word, 0, 0).w;
  bubbleWidth = Math.max(introWidth, wordWidth);


  bubbleHeight += utils.relSize(headingSize);
  textSize(utils.relSize(metaSize));
  const defWidth = f.textBounds(wordData.definitions[0].text).w;
  const lines = Math.ceil(defWidth / bubbleWidth)
  
  bubbleHeight += ((lines + 2) * utils.relSize(metaSize));
  bubbleHeight += utils.relSize(padding * 2); // padding between elements


  bubbleWidth += utils.relSize(padding * 4);
  bubbleHeight += utils.relSize(padding * 4); // padding around sides

  wordBubbleSize = {w: bubbleWidth, h: bubbleHeight};

  return wordBubbleSize;
}

function drawCorner(x1, y1, x2, y2, cornerSteps) {
  const cornerStepLengthX = (x2 - x1) / cornerSteps;
  const cornerStepLengthY = (y2 - y1) / cornerSteps;

  for (let index = 0; index < cornerSteps; index++) {
    vertex(x1 + index*cornerStepLengthX, y1 + index*cornerStepLengthY);
    vertex(x1 + (index + 1)*cornerStepLengthX, y1 + index*cornerStepLengthY);
  }

}


function drawBubble({w, h}, i, stationaryBubble) {
  push();
  translate(-utils.relSize(padding), 0);
  const cornerSteps = 4;
  const cornerRadius = utils.relSize(40);
  strokeWeight(utils.relSize(10));

  if(stationaryBubble) {
    stroke(utils.penColor);
    fill(noteColors[i]);  
  } else {
    stroke(bg[1]);
    fill(bg[0]);
  }
 

  beginShape();
  // top
  vertex(cornerRadius, 0);
  vertex(w - cornerRadius, 0);
  drawCorner(w - cornerRadius, 0, w, cornerRadius, cornerSteps);
  vertex(w, cornerRadius);
  vertex(w, h + cornerRadius);

  drawCorner(w, h+cornerRadius, w-cornerRadius, h, cornerSteps);

  vertex(w - cornerRadius, h);
  vertex(cornerRadius, h);

  drawCorner(cornerRadius, h, 0, h-cornerRadius, cornerSteps);

  vertex(0, h - cornerRadius);
  vertex(0, cornerRadius)
  drawCorner(0, cornerRadius, cornerRadius, 0, cornerSteps);

  endShape(CLOSE);
  pop();
}

function getQuoteBubbleSize() {

  if(factBubbleSize) {
    return factBubbleSize;
  }
  let bubbleWidth = utils.relSize(600);
  let bubbleHeight = 0;

  bubbleHeight += utils.relSize(metaSize);
  textSize(utils.relSize(factSize));
  const quoteWidth = f.textBounds(factData.text, 0, 0).w;
  const lines = Math.ceil(quoteWidth / bubbleWidth)
  bubbleHeight += ((lines + 2) * utils.relSize(factSize));

  bubbleWidth += utils.relSize(padding * 4);
  bubbleHeight += utils.relSize(padding * 4);

  factBubbleSize = {w: bubbleWidth, h: bubbleHeight};

  return factBubbleSize;
}

function drawQuoteNotification(stationaryBubble = false) {
  const s = getQuoteBubbleSize();
  push();

  let xP = width - s.w - utils.relSize(padding*8);
  let yP = height - utils.relSize(60) - s.h - utils.relSize(padding*4);
  if(!stationaryBubble) {
    xP = random(-s.w/2, width - s.w/2);
    yP = random(-s.h/2, yP);
  }

  translate(xP, yP);
  drawBubble(s, 1, stationaryBubble);

  let c = bg[1];
  if(stationaryBubble) {
    c = utils.penColor;
  }

  noStroke();
  fill(c);
  textSize(utils.relSize(metaSize));
  let yPointer = metaSize;
  yPointer += padding * 1.5;
  text("The fact of the day is:", utils.relSize(padding), utils.relSize(yPointer));
  yPointer += metaSize;
  yPointer += factSize;
  textSize(utils.relSize(factSize));
  text(factData.text, utils.relSize(padding), utils.relSize(yPointer), s.w - (utils.relSize(padding * 4)));
  pop();
}

function drawWordNotification(stationaryBubble = false) {
  const s = getWordBubbleSize();

  push();
  let xP = width - s.w;
  let yP = height - utils.relSize(60) - s.h - utils.relSize(padding*4);  

  if(!stationaryBubble) {
    xP = random(-s.w/2, width - s.w/2);
    yP = random(-s.h/2, yP);
  }

  translate(xP, yP);

  drawBubble(s, 0, stationaryBubble);

  noStroke();

  let c = bg[1];
  if(stationaryBubble) {
    c = utils.penColor;
  }

  fill(c);
  textSize(utils.relSize(metaSize));
  let yPointer = metaSize;
  yPointer += padding * 1.5;

  text("The word of the day is:", utils.relSize(padding), utils.relSize(yPointer));
  textSize(utils.relSize(headingSize));
  yPointer += headingSize;
  text(wordData.word, utils.relSize(padding), utils.relSize(yPointer));

  fill(stationaryBubble ? accentColor : bg[2]);
  textSize(utils.relSize(metaSize));
  yPointer += metaSize;
  yPointer += padding;
  yPointer += padding;
  text(wordData.definitions[0].partOfSpeech, utils.relSize(padding), utils.relSize(yPointer))
  // console.log(wordData.definitions)
  yPointer += metaSize;
  yPointer += padding;

  fill(c);
  text(wordData.definitions[0].text, utils.relSize(padding), utils.relSize(yPointer), s.w - (utils.relSize(padding * 4)));

  pop();

}

function draw() {

  push();
  utils.zoomOut(0.8);
  drawTaskBar();
  pop();
}


utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  