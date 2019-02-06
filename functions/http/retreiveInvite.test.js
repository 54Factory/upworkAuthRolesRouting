const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');
const { mockRequest } = require('mock-req-res');

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

describe('retrieveInvite tests', () => {
  let myFunctions;

  before(() => {
    try {
      admin.initializeApp();
      db = admin.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
    } catch (e) {/** do nothing */}


    myFunctions = require('./retreiveInvite.f.js');
  });

  after(() => test.cleanup());

  describe('retreiveInvite', () => {
    it ('retreiveInvite - online', done => {

      const data = { inviteId: 'TestId' };
      const content = {
        auth: { uid: 'test' },
        rawRequest: mockRequest()
      };

      myFunctions.default(data, content);


      done();
    });
  });
});
