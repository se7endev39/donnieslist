const User = require('../models/user');

//= =======================================
// User Routes
//= =======================================
exports.AdminsUsersList = (req, res, next) => {
  const userId = req.params.userId;
  if (req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view this user profile.' });
  }
  return User.find({}, (err, users) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }
    return res.status(200).json({ user: users });
  });
};
