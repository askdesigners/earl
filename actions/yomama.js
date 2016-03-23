var jokesFile = require('../data/mama.json');

var t = {};

t.tell = function (moduleCallback) {
  var pick = Math.floor(Math.random() * jokesFile.jokes.length);
  moduleCallback(null, '... ' + jokesFile.jokes[pick]);
};

module.exports = t;