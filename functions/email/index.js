const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp() } catch (e) {}

const config = functions.config();

// Require:
const postmark = require("postmark");

// Send an email:
const client = new postmark.ServerClient(config.email.apikey);

/**
 * Sends an Email
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @param {String} text - message body
 * @return {Promise}
 */
function sendEmail({ to, subject, text, html }) {
  const options = {
    From: config.email.auth.user,
    To: to,
    Subject: subject,
    TextBody: text,
    HtmlBody: html
  };

  return client.sendEmail(options);
}

exports = module.exports = {
  sendEmail
};

