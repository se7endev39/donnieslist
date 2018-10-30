// const Experts = require('../models/experts');
// const ExpertsSubcategories = require('../models/expertssubcategories');
const AudioSession = require('../models/audiosession');
// const User = require('../models/user');
const config = require('../config/main');
// included opentok api files
const OpenTok = require('../lib_opentok/opentok');

// Initialize OpenTok
const opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

/* API endpoint to create audio session  */
exports.createAudioSession = (req, res, /* next */) => {
  const expertEmail = req.body.expertEmail;
  const userEmail = req.body.userEmail;
  const username = req.body.username;

  opentok.createSession((error, session) => {
    const bind = {};
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! error occur while creating session';
      bind.error = error;

      return res.json(bind);
    }
    // Generate a token.
    const token = opentok.generateToken(session.sessionId);
    // addition of new record to table
    const newConAudio = new AudioSession();
    newConAudio.expertEmail = expertEmail;
    newConAudio.userEmail = userEmail;
    newConAudio.username = username;
    newConAudio.sessionId = session.sessionId;
    newConAudio.callStatus = 'connecting';

    return newConAudio.save((err) => {
      if (err) {
        return res.json({ err, sessionId: '', token: '' });
      }
      return res.json({
        err: '',
        sessionId: session.sessionId,
        token,
        newConAudioId: newConAudio._id
      });
    });
  });
};

exports.requestForToken = (req, res, /* next */) => {
  // const { email } = req.body;
  const newConAudioId = req.body.newConAudioId;

  AudioSession.findById(newConAudioId, (err, sessionInfo) => {
    if (sessionInfo) {
      const token = opentok.generateToken(sessionInfo.sessionId);
      return res.json({
        sessionId: sessionInfo.sessionId,
        username: sessionInfo.username,
        token,
        err: ''
      });
    }
    return res.json({ sessionId: '', token: '', err: 'error' });
  });
};
