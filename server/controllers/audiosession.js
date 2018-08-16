const Experts = require('../models/experts');
        const ExpertsSubcategories = require('../models/expertssubcategories');
        const AudioSession = require('../models/audiosession');
        const User = require('../models/user');
        const config = require('../config/main');
//included opentok api files
        var OpenTok = require('../lib_opentok/opentok');

// Initialize OpenTok
var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

/* API endpoint to create audio session  */
exports.createAudioSession = function (req, res, next) {
    var expertEmail = req.body.expertEmail;
    var userEmail = req.body.userEmail;
    var username = req.body.username;
            
    opentok.createSession(function (err, session) {
        var bind = {};
        if(err){
            bind['status'] = 0;
            bind['message'] = 'Oops! error occur while creating session';
            bind['error'] = err;
            
            return res.json(bind);
        } else {
            // Generate a token.
            var token = opentok.generateToken(session.sessionId);

            //addition of new record to table

            var newConAudio = new AudioSession();
            newConAudio.expertEmail = expertEmail;
            newConAudio.userEmail = userEmail;
            newConAudio.username = username;
            newConAudio.sessionId = session.sessionId;
            newConAudio.callStatus = 'connecting';


            newConAudio.save(function (err) {
                if (err) {
                    console.log("error: " + err);
                    return res.json({err: err, sessionId: "", token: ""});
                } else {
                    console.log("else 1");
                    return res.json({err: "", sessionId: session.sessionId, token: token, newConAudioId: newConAudio._id});
                }
            });
        }
    });
};

exports.requestForToken = function(req, res, next) {
    const email = req.body.email;
    const newConAudioId = req.body.newConAudioId;
    
    AudioSession.findById(newConAudioId, function(err, sessionInfo){
    if (sessionInfo) {
    var token = opentok.generateToken(sessionInfo.sessionId);
            return res.json({
                sessionId: sessionInfo.sessionId,
                username: sessionInfo.username,
                token : token,
                err : ""
        });
    } else{
        return res.json({ sessionId: "", token : "", err : "error" });
    }

});
};
