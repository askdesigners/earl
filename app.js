var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js'),
    Slack = require('slack-client'),
    caller = require(__dirname + '/actions/slackcaller.js'),
    tasks = require(__dirname + '/actions/tasks.js'),
    yomama = require(__dirname + '/actions/yomama.js');

require(__dirname + '/config/env.js')(express, app);

http.createServer(app).listen(opts.port, function () {
    console.log("Express server listening on port %d in %s mode", opts.port, app.settings.env);

    // var slackToken = 'xoxb-16322732656-WDJWISmlT6802tCJsuRPIzLi'; // prague college
    var slackToken = 'xoxb-16513719559-yx9Ee6dx7IzyXJyvAwetqPFb'; // mango
    var autoReconnect = true;
    var autoMark = true;

    var slack = new Slack(slackToken, autoReconnect, autoMark);

    slack.on('open', function(){
        console.log("Connected to "+ slack.team.name + " as " + slack.self.name);
    });

    slack.on('message', function(message){
        var msg = message.text,
            type = message.type,
            channel = slack.getChannelGroupOrDMByID(message.channel),
            user = slack.getUserByID(message.user);

            if(/wut/i.test(msg)){
                // translate
                var smsg = msg.split(' ');
                var destLang = smsg[1];
                var countBack = smsg[2];
                
                tasks.translate(slack, channel, destLang, countBack, function(err, say){
                    if(err){say = 'Well shit something went wrong... \n`' + err + '`'}
                    channel.send(say);
                });
            } else if(/yo\smama/i.test(msg)){
                yomama.tell(function (err, say) {
                    if(err){say = 'Well that went well... \n`' + err + '`'}
                    channel.send(say);
                });
            }

    });

    slack.on('error', function(err){
        console.error("Error", err);
    });

    slack.login();

});
