module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',
  // Database connection information
  // database: 'mongodb://db/donnysuserInfolist',
  // Setting port for server
  port: 3000,
  // Configuring Mailgun API for sending transactional email
  mailgun_priv_key: 'mailgun private key here',
  // Configuring Mailgun domain for sending transactional email
  mailgun_domain: 'mailgun domain here',
  // Mailchimp API key
  mailchimpApiKey: 'mailchimp api key here',
  // SendGrid API key
  sendgridApiKey: 'sendgrid api key here',

  // Stripe API key
  // stripeApiKey: 'sk_test_z8RFNnoaPTtap4kUehAMQ7Hi',

  stripeApiKey: 'sk_test_z8RFNnoaPTtap4kUehAMQ7Hi',
  stripePaymentAdminPercentage: 10, // percentage amount goes to admin for each transaction
  stripePaymentCurrencyCode: 'usd',

  // necessary in order to run tests in parallel of the main app
  test_port: 3001,
  test_db: 'mern-starter-test',
  test_env: 'test',

  // website_url: 'http://localhost:8080',
  website_url: 'https://www.donnieslist.com',

  // tokbox or opentok api details, trial period
  /* opentok_apiKey : "45891112",
  opentok_apiSecret : "3f67503337306c1937ea508c630c8de248a666bd", */

  // tokbox or opentok api details : live
  // updated on 23 april 2018 by mohit
  opentok_apiKey: '45801242',
  opentok_apiSecret: '1abf51d20a7facfb36dc9e473034ee97767403c0',

  // facebook login authentication
  facebookAuthClientID: '979601722141411',
  facebookAuthClientSecret: '15d9f17f05d8aa93fba76ba5ac4b104a',
  facebookAuthCallbackURL: 'https://www.donnieslist.com/api/auth/facebook/callback',

  // twitter login authentication
  twitterAuthConsumerKey: 'zUbW23kIoqmUyGvVDQIZctW4L',
  twitterAuthConsumerSecret: '7i0iLAEZ1E77A0SccSSs2lZgiWAt29938CWIKp7KM68hcGQr2P',
  twitterAuthCallbackURL: 'http://donnieslist.com/api/auth/twitter/callback',

  // gmail credentials for sending email : nodemailer
  gmailEmail: 'antony19951221@gmail.com',
  gmailPassword: 'Fivestar12/'

};
