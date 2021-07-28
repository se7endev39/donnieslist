const nodemailer = require('nodemailer');
/** config & constant */
const config = require('../config/main');
const OpenTok = require('../lib_opentok/opentok');
/** model */
const User = require('../models/user');
const ArchiveSession = require('../models/archivesession');

const opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

exports.getArchiveSessionAndToken = (req, res) => {
  const { expertEmail } = req.body;
  const { archiveSessionId } = req.body;
  User.findOne({ email: expertEmail }, (error, user) => {
    const bind = {};
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! No expert user found';
      return res.json(bind);
    }
    if (user) {
      if (archiveSessionId) {
        const sessionId = archiveSessionId;
        bind.status = 1;
        bind.archiveSessionId = sessionId;
        bind.archiveStreamtoken = opentok.generateToken(sessionId);
        return res.json(bind);
      }
      return opentok.createSession({ mediaMode: 'routed' }, (err, session) => {
        if (err) {
          bind.status = 0;
          bind.message = 'Oops! error occur while creating archive session';
        } else {
          const { sessionId } = session;
          bind.status = 1;
          bind.archiveSessionId = sessionId;
          bind.archiveStreamtoken = opentok.generateToken(sessionId);
        }
        return res.json(bind);
      });
    }
    bind.status = 0;
    bind.message = 'Oops! No expert user found';
    return res.json(bind);
  });
};

exports.start_recording = (req, res) => {
  const { expertEmail } = req.body;
  const { archiveSessionId } = req.body;

  User.findOne({ email: expertEmail }, (error, user) => {
    const bind = {};
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! No expert user found';
      return res.json(bind);
    }
    if (user) {
      bind.status = 1;
      return opentok.startArchive(
        archiveSessionId,
        {
          name: 'donnylist audio recording'
        },
        (err, archive) => {
          if (err) {
            bind.status = 0;
            bind.error = `Could not start archive for session ${archiveSessionId}. error=${
              err.message
            }`;
          } else {
            bind.archive = archive;
          }
          return res.json(bind);
        }
      );
    }
    bind.status = 0;
    bind.message = 'Oops! No expert user found';
    return res.json(bind);
  });
};

exports.stop_recording = (req, res) => {
  const { archiveID } = req.params;
  const bind = {};

  opentok.stopArchive(archiveID, (err, archive) => {
    if (err) {
      bind.status = 0;
      bind.error = `Could not stop archive ${archiveID}. error=${err.message}`;
    } else {
      bind.status = 1;
      bind.archive = archive;
    }
    return res.json(bind);
  });
};

exports.send_recording = (req, res) => {
  const { expertEmail } = req.body;
  const { userEmail } = req.body;
  const { archiveID } = req.body;

  User.findOne({ email: expertEmail }, (error, user) => {
    const bind = {};
    if (error) {
      bind.status = 0;
      bind.message = 'Oops! No expert user found';
      return res.json(bind);
    }
    if (user) {
      return opentok.getArchive(archiveID, (err, archive) => {
        if (err) {
          bind.status = 0;
          bind.error = `Could not get archive ${archiveID}. error=${err.message}`;
        } else {
          bind.status = 1;
          bind.archive_url = archive;

          const smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
              user: config.gmailEmail,
              pass: config.gmailPassword
            }
          });

          /* email for session requester */
          let html = `Hello , <br> You have new voice message from email: ${userEmail}`;
          html += `<p>Clicke here to listen : </p>${archive.url}`;

          // expertEmail = 'avadhesh_bhatt@rvtechnologies.co.in';
          // expertEmail = 'mohit@rvtechnologies.co.in';

          const mailOptions = {
            from: 'Donnys list <no-reply@donnyslist.com>',
            to: expertEmail,
            subject: 'Donnys List - New Voice Message',
            html
          };

          smtpTransport.sendMail(mailOptions, (error1, info) => {
            if (error1) {
              console.error('*** nodemailer error ***', error1);
            } else {
              console.error('*** nodemailer success *** Message %s', info.messageId);
            }
            // return res.json(bind);
          });
          const newArchiveSession = new ArchiveSession();
          newArchiveSession.archiveId = archive.id;
          newArchiveSession.archive_name = archive.name;
          newArchiveSession.sessionId = archive.sessionId;
          newArchiveSession.createdAt = archive.createdAt;
          newArchiveSession.size = archive.size;
          newArchiveSession.duration = archive.duration;
          newArchiveSession.updatedAt = archive.updatedAt;
          newArchiveSession.archiveUrl = archive.url;
          newArchiveSession.expertEmail = expertEmail;
          newArchiveSession.userEmail = userEmail;
          newArchiveSession.status = archive.status;
          newArchiveSession.save();
        }
        return res.json(bind);
      });
    }
    bind.status = 0;
    bind.message = 'Oops! No expert user found';
    return res.json(bind);
  });
};

exports.getExpertRecordings = (req, res) => {
  const { expertEmail } = req.body;
  const bind = {};
  ArchiveSession.aggregate(
    [
      {
        $match: { expertEmail }
      },

      {
        $lookup: {
          from: 'users',
          localField: 'expertEmail',
          foreignField: 'email',
          as: 'user'
        }
      },

      {
        $unwind: '$user'
      },

      {
        $project: {
          _id: 1,
          archiveId: 1,
          archiveUrl: 1,
          archive_name: 1,
          duration: 1,
          size: 1,
          updatedAt: 1,
          senderName: { $concat: ['$user.profile.firstName', ' ', '$user.profile.lastName'] }
        }
      },

      {
        $sort: { _id: -1 }
      }
    ],
    (err, recordings) => {
      if (err) {
        bind.status = 0;
        bind.message = err;
      } else {
        bind.status = 1;
        bind.recordings = recordings;
      }
      return res.json(bind);
    }
  );
};

exports.playRecordedAudio = (req, res) => {
  const { archiveId } = req.body;
  const bind = {};

  opentok.getArchive(archiveId, (err, archive) => {
    if (err) {
      bind.status = 0;
      bind.message = `Could not get archive ${archiveId}. error=${err.message}`;
    } else {
      bind.status = 1;
      bind.archive_url = archive.url;
    }

    return res.json(bind);
  });
};

exports.deleteRecordedAudio = (req, res) => {
  const { archiveId } = req.body;
  const { id } = req.body;
  const bind = {};

  ArchiveSession.remove({ _id: id }, (error) => {
    if (!error) {
      bind.status = 1;
      bind.message = 'Recording was deleted successfully!';

      return opentok.deleteArchive(archiveId, (err) => {
        if (err) {
          bind.error = `Could not stop archive ${archiveId}. error=${err.message}`;
        }
        return res.json(bind);
      });
    }
    bind.status = 0;
    bind.message = 'Oops! error occur while deleting recording';
    return res.json(bind);
  });
};
