const Sessionmessages = require('../models/sessionmessages');

exports.expertsessionchat = (req, res, next) => {
  const messageSenderEmail = req.body.messageSenderEmail;
  const messageReceiverEmail = req.body.messageReceiverEmail;
  const composedMessage = req.body.composedMessage;
  const sessionOwnerUsername = req.body.sessionOwnerUsername;
  const date = req.body.date;
  if (
    messageSenderEmail !== undefined &&
    messageSenderEmail !== null &&
    (messageReceiverEmail !== undefined && messageReceiverEmail !== null) &&
    (composedMessage !== undefined && composedMessage !== null) &&
    (sessionOwnerUsername !== undefined && sessionOwnerUsername !== null)
  ) {
    const reply = new Sessionmessages({
      messageSenderEmail,
      messageReceiverEmail,
      sessionOwnerUsername,
      message: composedMessage,
      messageTime: date
    });
    return reply.save((err /* sentReply */) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ message: 'Reply successfully sent!' });
    });
  }
  return res.json('[]');
};

exports.fetchSessionChat = (req, res) => {
  const sessionOwnerUsername = req.params.sessionOwnerUsername;
  const email = req.params.email;
  if (sessionOwnerUsername !== undefined && sessionOwnerUsername !== null) {
    return Sessionmessages.aggregate(
      [
        {
          // $match: {"sessionOwnerUsername": { $regex : new RegExp(sessionOwnerUsername, "i") } }
          $match: {
            $or: [
              {
                $and: [
                  { sessionOwnerUsername: { $regex: new RegExp(sessionOwnerUsername, 'i') } },
                  { messageSenderEmail: email }
                ]
              },
              {
                $and: [
                  { sessionOwnerUsername: { $regex: new RegExp(sessionOwnerUsername, 'i') } },
                  { messageReceiverEmail: email }
                ]
              }
            ]
          }
        },
        {
          $sort: { messageTime: 1 }
        }
      ],
      (err, messagesList) => res.status(200).json({ conversation: messagesList })
    );
  }
  return res.status(200).json({ conversation: '' });
};
