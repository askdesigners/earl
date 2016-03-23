var https = require('https');
var async = require('async');
var querystring = require('querystring');
var googleTranslate = require('google-translate')('AIzaSyBWrL2WYkLB6LDNr_RJeXYHDOJ18WZhi8E');

var t = {};

t.translate = function (slack, channel, destLang, countBack, moduleCallback) {
  var count = countBack || 1, srcLang;
  count++;
  channel.fetchHistory(count, null, null, function(history){

    if(destLang == 'en'){
      srcLang = 'cs';
    } else if(destLang == 'cs' || destLang == 'cz'){
      destLang = 'cs';
      srcLang = 'en';
    } else {
      destLang = 'en';
      srcLang = 'cs';
    }

    history.messages.shift();
    console.log('langs', srcLang, destLang);
    async.map(
      history.messages, 
      function (message, cb) {
        googleTranslate.translate(message.text, srcLang, destLang, function(err, translations) {
          if(err){
            cb(err, null);
          } else {
            cb(null, {user: message.user, text: translations.translatedText, origText: translations.originalText});
          }
        })
      },
      function(err, results){
        var say = ''
        if(!err){
          for (var i = results.length - 1; i >= 0; i--) {
            say += '_' + results[i].origText + '_ \n *' + results[i].text + '*\n\n';
          };
        }
        moduleCallback(err, say);
      }
    );
  });
};

function translateMany(msgArr){
  async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    },
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
  ],
  // optional callback
  function(err, results){
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
  });
}

module.exports = t;