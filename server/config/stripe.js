const Stripe = require('stripe');
const config = require('./main');

const stripe = Stripe(config.stripeApiKey, { timeout: 20000 });

module.exports = stripe;
