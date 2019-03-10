const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

const env = require('./env.json');

const test = require('firebase-functions-test')();

test.mockConfig({
  email: {
    host: env.email.host,
    port: env.email.port,
    auth: {
      user: env.email.auth.user,
      pass: env.email.auth.pass
    }
  }
});

const nodemailer = require('nodemailer');
const mailer = require('./email');

// stub send email functions
sinon.stub(mailer, 'sendEmail').yields(null, {
  message: '250 2.0.0 OK 1403606574 og3sm31277838pbc.48 - smtp',
  messageId: 'adefbd50fb8c11e3a3ac0800200c9a66@localhost'
});
