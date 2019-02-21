const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');

let db;
// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require('firebase-functions-test')({
  projectId: 'test-74eb3',
  databaseURL: 'https://test-74eb3.firebaseio.com/'
}, './key.json');

const functions = require('firebase-functions');

test.mockConfig({
  email: {
    provider: 'gmail',
    auth: {
      user: 'kmurf1999@gmail.com',
      pass: 'GDklgf03434t3$'
    }
  }
});

describe('createUser tests', () => {
  let myFunctions;

  before(() => {
    try {
      admin.initializeApp();
      db = admin.firestore();
    } catch (e) {/** do nothing */}

    myFunctions = require('./createUser.f.js');
  });

  after(() => test.cleanup());

  describe('generatePassword', () => {
    it('Should return a 15 char string', () => {
      const pass = myFunctions.generatePassword();
      assert.equal(pass.length, 15);
    });
  });

  describe('sendInvite - offline', () => {
    it('Should call sendEmail with correct params', () => {
      const mailer = require('../email');
      const inviteTemplate = require('../email/templates/invite');

      const sendEmailStub = sinon.stub(mailer, 'sendEmail');
      const display_name = 'Test Name';
      const email = 'test@test.com';
      const id = 'TESTIDTESTID';

      const msg = inviteTemplate({
        display_name, email,
        url: `http://localhost:3000/create?v=${id}`
      });

      const args = {
        from: functions.config().email.auth.user,
        to: email,
        subject: 'Welcome to Eden Green',
        text: msg.text,
        html: msg.html
      };

      sendEmailStub.withArgs(args).returns(true);

      assert.isTrue(myFunctions.sendInvite(display_name, email, id));

      assert(sendEmailStub.calledOnce);
    });
  });

  describe('createSetupLink - online', () => {
    const userId = 'asddkj2KJsafsd';

    after(done => {
      let promises = [];
      db.collection('SetupLinks')
        .where('uid', '==', userId).get()
        .then(snap => {
          snap.forEach(doc => {
            promises.push(
              db.collection('SetupLinks').doc(doc.id).delete()
            );
          });
          Promise.all(promises).then(() => done());
        });
    });

    it('Should create a link', done => {
      myFunctions.createSetupLink(userId).then(doc => {
        const data = doc.data();

        assert.isTrue(doc.exists);
        assert.equal(data.uid, userId);

        done();
      });
    });
  });

  describe('removeOldLinks - online', () => {
    const userId = 'asddkj2KJsafsd';
    let promises = [];

    before(done => {

      promises.push(db.collection('SetupLinks')
        .add({
          uid: userId,
          created_on: new Date().getTime(),
          expires_on: new Date().getTime() + 86400000,
          valid: true
      }));
      promises.push(db.collection('SetupLinks')
        .add({
          uid: userId,
          created_on: new Date().getTime(),
          expires_on: new Date().getTime() + 86400000,
          valid: true
      }));
      Promise.all(promises).then(() => done());
    });

    it('Removes links with same uid', done => {
      myFunctions.removeOldLinks(userId).then(() => {
        db.collection('SetupLinks')
          .where('uid', '==', userId)
          .get()
          .then(snap => {
            snap.forEach(doc => console.log(doc.id));
            assert.equal(snap.size, 0);
            done();
        });
      });
    });
  });

});
