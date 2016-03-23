var https = require('https');
var querystring = require('querystring');
var slackToken = 'xoxb-16322732656-WDJWISmlT6802tCJsuRPIzLi';

module.exports = function(method, params, callback) {
    var options, post_data, req;
    params['token'] = slackToken;
    post_data = querystring.stringify(params);
    options = {
      hostname: 'api.slack.com',
      method: 'POST',
      path: '/api/' + method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };
    // console.log('var1');
    req = https.request(options);
    req.on('response', function(res) {
      var buffer = '';
      res.on('data', function(chunk) {
        buffer += chunk;
      });
      res.on('end', function() {
        var value;
        if (callback != null) {
          if (res.statusCode === 200) {
            value = JSON.parse(buffer);
            callback(value);
          } else {
            callback({
              'ok': false,
              'error': 'API response: ' + res.statusCode
            });
          }
        }
      });
    });
    req.on('error', function(error) {
      if (callback != null) {
        callback({
          'ok': false,
          'error': error.errno
        });
      }
    });
    req.write('' + post_data);
      req.end();
  };