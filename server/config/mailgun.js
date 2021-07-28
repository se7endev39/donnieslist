const mailGunJS = require('mailgun-js');
const config = require('./main');

const mailgun = mailGunJS({
  apiKey: config.mailgun_priv_key,
  domain: config.mailgun_domain
});

// Create and export function to send emails through Mailgun API
exports.sendEmail = (recipient, message) => {
  const data = {
    from: 'Your Site <info@yourdomain.com>',
    to: recipient,
    subject: message.subject,
    text: message.text
  };

  mailgun.messages().send(data, (error, body) => {
    console.log('[MAIL]:[GUN]:', body);
  });
};

exports.contactForm = (sender, message) => {
  const data = {
    from: sender,
    to: 'you@yourdomain.com',
    subject: message.subject,
    text: message.text
  };

  mailgun.messages().send(data, (error, body) => {
    console.log('[MAIL]:[GUN]:', body);
  });
};
