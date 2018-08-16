const ArchiveSession = require('../models/archivesession');
const config = require('../config/main');
const User = require('../models/user');
var OpenTok = require('../lib_opentok/opentok');
var nodemailer = require("nodemailer");

var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

exports.getArchiveSessionAndToken = function(req, res, next){
    const expertEmail = req.body.expertEmail;
    const userEmail = req.body.userEmail;
    const archiveSessionId = req.body.archiveSessionId;
    User.findOne({ email: expertEmail }, function(err, user){
        const bind = {};
        if (user){
            if (archiveSessionId){
                var sessionId = archiveSessionId;
                bind['status'] = 1;
                bind['archiveSessionId'] = sessionId;
                bind['archiveStreamtoken'] = opentok.generateToken(sessionId);
                return res.json(bind);
            } else {
                opentok.createSession({ mediaMode: 'routed' }, function(err, session) {
                    if (err) {
                        bind['status'] = 0;
                        bind['message'] = 'Oops! error occur while creating archive session';
                    } else{
                        var sessionId = session.sessionId;
                        bind['status'] = 1;
                        bind['archiveSessionId'] = sessionId;
                        bind['archiveStreamtoken'] = opentok.generateToken(sessionId);
                    }
                    return res.json(bind);
                });
            }
        } else {
        bind['status'] = 0;
                bind['message'] = 'Oops! No expert user found';
                return res.json(bind);
        }

    });
}

exports.start_recording = function (req, res, next) {
    const expertEmail = req.body.expertEmail;
    const userEmail = req.body.userEmail;
    const archiveSessionId = req.body.archiveSessionId;

    User.findOne({ email: expertEmail },  function(err, user){
        const bind = {};
        if(user){
            bind['status'] = 1;
            opentok.startArchive(archiveSessionId, {
              name: 'donnylist audio recording',
            }, function(err, archive) {
              if (err){
                  bind['status'] = 0;
                  bind['error'] = 'Could not start archive for session '+archiveSessionId+'. error='+err.message;
              } else {
                  bind['archive'] = archive;
              }
              return res.json(bind);

            });
        } else {
            bind['status'] = 0;
            bind['message'] = 'Oops! No expert user found';
            return res.json(bind);
        }

    });
};

exports.stop_recording = function (req, res, next) {
    const expertEmail = req.params.expertEmail;
    const userEmail = req.params.userEmail;
    const archiveID = req.params.archiveID;

    const bind = {};

    opentok.stopArchive(archiveID, function(err, archive) {
      if (err){
          bind['status'] = 0;
          bind['error'] = 'Could not stop archive '+archiveID+'. error='+err.message;
          //return res.send(500, 'Could not stop archive '+archiveID+'. error='+err.message);
      } else{
        bind['status'] = 1;
        bind['archive'] = archive;
      }
      res.json(bind);
    });
}

exports.send_recording = function (req, res, next) {
    var expertEmail = req.body.expertEmail;
    var userEmail = req.body.userEmail;
    var archiveID = req.body.archiveID;

    User.findOne({ email: expertEmail },  function(err, user){
        const bind = {};
        if(user){
            opentok.getArchive(archiveID, function(err, archive) {
              if (err){
                  bind['status'] = 0;
                  bind['error'] = 'Could not get archive '+archiveID+'. error='+err.message;
              } else {
                  bind['status'] = 1;
                  bind['archive_url'] = archive;
                  
                    var smtpTransport = nodemailer.createTransport("SMTP",{
                        service: "Gmail",
                        auth: {
                            user: config.gmailEmail,
                            pass: config.gmailPassword
                        }
                    });

                    /* email for session requester */
                    var html = 'Hello , <br> You have new voice message from email: '+userEmail;
                    html += '<p>Clicke here to listen : </p>'+archive.url;


                    //expertEmail = 'avadhesh_bhatt@rvtechnologies.co.in';
                    //expertEmail = 'mohit@rvtechnologies.co.in';

                    var mailOptions = {
                        from   : "Donnys list <no-reply@donnyslist.com>",
                        to     : expertEmail,
                        subject: "Donnys List - New Voice Message",
                        html   : html
                    };
                    
                    smtpTransport.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log('*** nodemailer error ***'+error);
                        } else{
                            console.log('*** nodemailer success *** Message %s', info.messageId);
                        }
                        //return res.json(bind);
                    });

//                    nodemailer.mail(mailOptions, function(error, info)  {
//                        if (error) {
//                            console.log('*** nodemailer error ***'+error);
//                        } else{
//                            console.log('*** nodemailer success *** Message %s sent: %s', info.messageId, info.response);
//                        }
//                        //return res.json(bind);
//
//                    });

                    
                    /**** Save archive information to database ****/
                    
                    var newArchiveSession = new ArchiveSession();
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
        } else {
            bind['status'] = 0;
            bind['message'] = 'Oops! No expert user found';
            return res.json(bind);
        }

    });
};


exports.getExpertRecordings = function (req, res, next) {
    var expertEmail = req.body.expertEmail;
    var bind = {};
    
    ArchiveSession.aggregate([
        {
            $match : { expertEmail: expertEmail },
        },
        
        {
            $lookup:{
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
                updatedAt:1,
                senderName: { $concat: [ '$user.profile.firstName', ' ', '$user.profile.lastName' ] }

            
            }
        },
        
        {
            $sort: { _id: -1 }
        }
        
        
    ], function(err, recordings){
        if(err){
            bind['status'] = 0;
            bind['message'] = err;
        } else {
            bind['status'] = 1;
            bind['recordings'] = recordings;
        }
        return res.json(bind);
    });
    
} 

exports.playRecordedAudio = function (req, res, next) {
    var archiveId = req.body.archiveId;
    var bind = {};
    
    opentok.getArchive(archiveId, function(err, archive) {
        if (err){ 
            bind['status'] = 0;
            bind['message'] = 'Could not get archive '+archiveId+'. error='+err.message;
        } else {
            bind['status'] = 1;
            bind['archive_url'] = archive.url;
        }
        
        res.json(bind);
    });
    
} 

exports.deleteRecordedAudio = function (req, res, next) {
    var archiveId = req.body.archiveId;
    var id = req.body.id;
    var bind = {};
    
    ArchiveSession.remove({ _id: id }, function(err) {
        if (!err) {
            bind['status'] = 1;
            bind['message'] = 'Recording was deleted successfully!';
            
            opentok.deleteArchive(archiveId, function(err) {
                if (err){
                    bind['error'] = 'Could not stop archive '+archiveId+'. error='+err.message;
                } 
                return res.json(bind);
            });
                
        }
        else {
            bind['status'] = 0;
            bind['message'] = 'Oops! error occur while deleting recording';
            
            return res.json(bind);
                
        }
    });
    
}



