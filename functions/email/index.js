const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const config = functions.config();

const transporter = nodemailer.createTransport({
  service: config.email.provider,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});

/**
 * Sends an Email
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @param {String} text - message body
 * @return {Promise}
 */
function sendEmail({ from, to, subject, text, html }) {
  const options = {
    from, to, subject, text, html
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

exports = module.exports = {
  sendEmail
};

