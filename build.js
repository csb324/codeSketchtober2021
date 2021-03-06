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
  var html = renderTemplate({
    pieces: Object.values(piecesWithFilenames)
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

    fs.writeFile("./build/" + p.file + ".html", html, err => {
      if (err) console.log(err);
      console.log("File " + p.file + " written succesfully");
    });
  })
}
build();