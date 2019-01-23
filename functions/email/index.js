const nodemailer = require('nodemailer');
const fs = require('fs');

// read .env variables for mail config
let env = {};
fs.readFileSync('../../.env')
  .toString()
  .match(/EMAIL\S*/g)
  .forEach(line => {
    env[line.split('=')[0]] = line.split('=')[1].replace(/(\'|\")/g, '');
  });

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: env.EMAILER_AUTH_USERNAME,
    pass: env.EMAIL_AUTH_PASSWORD
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
function sendEmail({ from, to, subject, text }) {
  const options = {
    from, to, subject, text
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

