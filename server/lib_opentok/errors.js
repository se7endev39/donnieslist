exports.ArgumentError = (message) => {
  this.message = message;
};

exports.ArgumentError.prototype = Object.create(Error.prototype);

exports.AuthError = (message) => {
  this.message = message;
};

exports.AuthError.prototype = Object.create(Error.prototype);

exports.ArchiveError = (message) => {
  this.message = message;
};

exports.SipError = (message) => {
  this.message = message;
};

exports.ArchiveError.prototype = Object.create(Error.prototype);

exports.RequestError = (message) => {
  this.message = message;
};

exports.RequestError.prototype = Object.create(Error.prototype);
