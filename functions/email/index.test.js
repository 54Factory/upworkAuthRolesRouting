const chai = require('chai');
const assert = chai.assert;

const env = require('../.env.json');

const test = require('firebase-functions-test')();
const admin = require('firebase-admin');

try { admin.initializeApp() } catch (e) {}

test.mockConfig({
  email: {
    apikey: env.email.apikey,
    host: env.email.host,
    port: env.email.port,
    auth: {
      user: env.email.auth.user,
      pass: env.email.auth.pass
    }
  },
  client: {
    url: env.client.url
  }
});

const mailer = require('./index');

describe('email config test', () => {
  before(() => {

  });

  after(() => {
    test.cleanup();
  });

  const mailOptions = {
    from: `Test server <${env.email.auth.user}>`,
    to: env.email.auth.user,
    subject: "Email Test",
    text: "This is an email test",
    html: "None"
  };

  it('Should be able to send message', done => {
    mailer.sendEmail(mailOptions).then(info => {
      assert.equal(info.Message, 'OK');
      assert.equal(info.ErrorCode, 0);
    }).catch(err => {
      assert.isNull(err);
    }).finally(done);
  });
});
