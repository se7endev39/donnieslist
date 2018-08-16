const Sessionmessages = require('../models/sessionmessages'),
      User = require('../models/user');

exports.expertsessionchat = function (req, res, next) {
  var messageSenderEmail  = req.body.messageSenderEmail,
  messageReceiverEmail    = req.body.messageReceiverEmail,
  composedMessage         = req.body.composedMessage,
  sessionOwnerUsername    = req.body.sessionOwnerUsername;
  date                    = req.body.date;

  console.log('messageSenderEmail: '+messageSenderEmail);
  console.log('messageReceiverEmail: '+messageReceiverEmail);
  console.log('composedMessage: '+composedMessage);
  console.log('sessionOwnerUsername: '+sessionOwnerUsername);

  if (
        (messageSenderEmail !== undefined && messageSenderEmail !== null)
      &&
        (messageReceiverEmail !== undefined && messageReceiverEmail !== null)
      &&
        (composedMessage !== undefined && composedMessage !== null)
      &&
        (sessionOwnerUsername !== undefined && sessionOwnerUsername !== null)
    )
  {
     /*insertion of new message into database table */
     // console.log("N E W T I M E")
     // console.log(new Date())
    const reply = new Sessionmessages({
      messageSenderEmail    : messageSenderEmail,
      messageReceiverEmail  : messageReceiverEmail,
      sessionOwnerUsername  : sessionOwnerUsername,
      message               : composedMessage,
      messageTime           : date
    });
    reply.save((err, sentReply) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ message: 'Reply successfully sent!' });
    });

  } else {
    console.log('else');
    res.json("[]");
  }
};

exports.fetchSessionChat = function (req, res, next) {
  var sessionOwnerUsername    = req.params.sessionOwnerUsername;
  var email                   = req.params.email
  console.log('** ** ** sessionOwnerUsername '+sessionOwnerUsername);
    console.log('** ** ** email '+email);
  if ( sessionOwnerUsername !== undefined && sessionOwnerUsername !== null ){
    Sessionmessages.aggregate([
        {
          // $match: {"sessionOwnerUsername": { $regex : new RegExp(sessionOwnerUsername, "i") } }
          $match:{
            $or: [
                {$and: [{"sessionOwnerUsername": { $regex : new RegExp(sessionOwnerUsername, "i") } }, {'messageSenderEmail': email}]},
                {$and: [{"sessionOwnerUsername": { $regex : new RegExp(sessionOwnerUsername, "i") } }, {'messageReceiverEmail': email}]}
            ]
          }
        },
        {
          $sort: {  'messageTime': 1   }
        }
    ], function (err, messagesList) {
        return res.status(200).json({ conversation: messagesList });
    });
  } else {
    return res.status(200).json({ conversation: "" });
  }
};

// db.getCollection('sessionmessages').aggregate([
//         {
//           $match:{
//             $or: [
//                 {$and: [{"sessionOwnerUsername": "ava-sde" }, {'messageSenderEmail':"sukhpreet_singh@rvtechnologies.co.in" }]},
//                 {$and: [{"sessionOwnerUsername": "ava-sde" }, {'messageReceiverEmail': "sukhpreet_singh@rvtechnologies.co.in"}]}
//             ]
//           }
//         },
//         {
//           $sort: {  'messageTime': 1   }
//         }
//     ])