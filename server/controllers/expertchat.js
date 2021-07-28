const Sessionmessages = require('../models/sessionmessages');

exports.expertsessionchat = (req, res, next) => {
  const { messageSenderEmail } = req.body;
  const { messageReceiverEmail } = req.body;
  const { composedMessage } = req.body;
  const { sessionOwnerUsername } = req.body;
  const { date } = req.body;
  if (
    messageSenderEmail !== undefined
    && messageSenderEmail !== null
    && (messageReceiverEmail !== undefined && messageReceiverEmail !== null)
    && (composedMessage !== undefined && composedMessage !== null)
    && (sessionOwnerUsername !== undefined && sessionOwnerUsername !== null)
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
  const { sessionOwnerUsername } = req.params;
  const { email } = req.params;
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
