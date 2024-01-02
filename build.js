var fs = require('fs');
var path = require('path');
var handlebars = require("handlebars");
var layouts = require('handlebars-layouts');
var copyfiles = require('copyfiles');

const piecesWithFilenames = require('./prompts.js');

function build() {
  handlebars.registerHelper(layouts(handlebars));
  var layoutFile = fs.readFileSync(
    path.resolve(path.join(__dirname, 'views','layouts', 'index.hbs')), "utf-8"
  );
  layoutFile = updateLayout(layoutFile);
  handlebars.registerPartial('layout', layoutFile);

  copyfiles(["./public/**/*", "./build/"], {up: 1}, () => {
    buildIndex();
    buildPieces(piecesWithFilenames);  
  });
}

function buildIndex() {
  var template = fs.readFileSync(
    path.resolve(path.join(__dirname, 'views/index.hbs')), "utf-8"
  );
  template = wrapTemplate(template);
  var renderTemplate = handlebars.compile(template);
  var pieces = Object.values(piecesWithFilenames).sort((a, b) => a.file - b.file );

  pieces.reverse();
  console.log(pieces);

  var html = renderTemplate({
    pieces: pieces
  });

  fs.writeFile("./build/index.html", html, err => {
    if (err) console.log(err);
    console.log("File " + "index" + " written succesfully");
  });
}

function updateLayout(l) {
  return l.split("{{{ body }}}").join("{{#block \"body\"}}  {{/block}}")
}
function wrapTemplate(t) {
  return `
  {{#extend "layout" }}
  {{#content "body"}}
  ${t}
  {{/content}}
  {{/extend}}
  `
}


function buildPieces(pieces) {
  var template = fs.readFileSync(
    path.resolve(path.join(__dirname, 'views/piece.hbs')), "utf-8"
  );

  template = wrapTemplate(template);
  var renderTemplate = handlebars.compile(template);
  // console.log(fileData);
  // Write to build folder. Copy the built file and deploy
  Object.values(pieces).forEach((p, i) => {
    var html = renderTemplate({
      name: p.name,
      scriptName: p.file + ".js"
    });

    if(p.file.search('/') > 0) {
      var dir = p.file.split('/')[0]
      if(!fs.existsSync('./build/' + dir)) { fs.mkdirSync('./build/' + dir)}
    }
    
    fs.writeFile("./build/" + p.file + ".html", html, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("File " + p.file + " written succesfully");
      }
    });
  })
}
build();