const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

const env = require('../.env.json');

const admin = require('firebase-admin');
// local testing
const test = require('firebase-functions-test')();

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

const mailer = require('../email');

describe('createUser', () => {
  let myFunctions, adminInitStub, sendEmailStub;

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    // firestore stub
    firestoreStub = sinon.stub(admin, 'firestore');
    // stub send email functions
    sendEmailStub = sinon.stub(mailer, 'sendEmail').returns({
      message: '250 2.0.0 OK 1403606574 og3sm31277838pbc.48 - smtp',
      messageId: 'adefbd50fb8c11e3a3ac0800200c9a66@localhost'
    });

    myFunctions = require('./createUser.f');
  });

  after(() => {
    adminInitStub.restore();
    sendEmailStub.restore();
    test.cleanup();
  });

  describe('sendInvite', () => {
    it('should call sendEmail with correct args', () => {
      const args = {
        display_name: 'test',
        email: 'test@localhost',
        id: '123456789qwerty'
      };

      const res = myFunctions.sendInvite(args.display_name, args.email, args.id);
      assert.isDefined(res.message);
      assert.isDefined(res.messageId);
      assert.equal(sendEmailStub.getCall(0).args[0].from, env.email.auth.user);
      assert.equal(sendEmailStub.getCall(0).args[0].to, args.email);
    });
  });

  describe('createSetupLink', () => {
    it('Should create new firestore doc', done => {
      const id = '123456789qwerty';
      const password = 'qwerty123456789';
      const firestoreStub = sinon.stub();
      const refStub = sinon.stub();
      const addStub = sinon.stub();

      sinon.stub(admin, 'firestore').get(() => firestoreStub);
      firestoreStub.returns({ collection: refStub });
      refStub.withArgs('SetupLinks').returns({ add: addStub });
      addStub.returns(Promise.resolve({ get: () => 'new_ref' }));

      myFunctions.createSetupLink(id, password).then(ref => {
        assert.equal(ref, 'new_ref');
        done();
      });
    });
  });

  describe('removeOldLinks', () => {
    it('Should call correct functions', done => {
      const id = '123456789qwerty';

      const firestoreStub = sinon.stub();
      const refStub = sinon.stub();
      const whereStub = sinon.stub();
      const getStub = sinon.stub();
      const docStub = sinon.stub();
      const deleteStub = sinon.stub();

      const fakeDoc = Promise.resolve([{ id }]);

      sinon.stub(admin, 'firestore').get(() => firestoreStub);
      firestoreStub.returns({ collection: refStub });
      refStub.withArgs('SetupLinks').returns({ where: whereStub, doc: docStub });
      whereStub.withArgs('uid', '==', id).returns({ get: getStub });
      getStub.returns(Promise.resolve([{ id }, { id }]));
      docStub.withArgs(id).returns({ delete: deleteStub });
      deleteStub.returns(Promise.resolve({ id }));

      myFunctions.removeOldLinks(id).then(args => {
        assert.equal(args[0].id, id);
        assert.equal(args[1].id, id);
        done();
      });
    });
  });

  describe('createUser offline test', () => {
    it('Should throw https error if not called by ADMIN', () => {
      const wrapped = test.wrap(myFunctions.default);
      const data = {
        email: 'test@localhost',
        display_name: 'test name',
        role: 'CUSTOMER'
      };

      const context = {
        auth: {
          token: {
            role: 'CUSTOMER'
          }
        }
      };

      try {
        wrapped(data, context);
      } catch(err) {
        assert.equal(err.message, 'Must be an admin to call this function');
      }
    });

    it('Should throw error if no email', () => {
      const wrapped = test.wrap(myFunctions.default);
      const data = {
        display_name: 'test name',
        role: 'CUSTOMER'
      };

      const context = {
        auth: {
          token: {
            role: 'ADMIN'
          }
        }
      };

      try {
        wrapped(data, context);
      } catch(err) {
        assert.equal(err.message, 'Invalid email');
      }
    });

    it('Should throw error if role is not valid', () => {
      const wrapped = test.wrap(myFunctions.default);
      const data = {
        display_name: 'test name',
        role: 'INVALIDROLE'
      };

      const context = {
        auth: {
          token: {
            role: 'ADMIN'
          }
        }
      };

      try {
        wrapped(data, context);
      } catch(err) {
        assert.equal(err.message, 'Invalid role');
      }
    });

    it('Should call create new user and send email', () => {
      const data = {
        email: 'test@localhost',
        display_name: 'test name',
        role: 'CUSTOMER'
      };

      const uid = 'customeuid';

      const context = {
        auth: {
          token: {
            role: 'ADMIN'
          }
        }
      };

      const authStub = sinon.stub();
      const firestoreStub = sinon.stub();
      const createUserStub = sinon.stub();
      const setCustomUserClaimsStub = sinon.stub();
      const refStub = sinon.stub();
      const docStub = sinon.stub();
      const setStub = sinon.stub();

      sinon.stub(myFunctions, 'createSetupLink');
      sinon.stub(myFunctions, 'sendInvite');

      sinon.stub(admin, 'auth').get(() => authStub);
      sinon.stub(admin, 'firestore').get(() => firestoreStub);
      firestoreStub.returns({
        collection: refStub
      });
      authStub.returns({
        createUser: createUserStub,
        setCustomUserClaims: setCustomUserClaimsStub
      });

      refStub.withArgs('Users').returns({ doc: docStub });
      docStub.withArgs(uid).returns({ set: setStub });
      createUserStub.returns(Promise.resolve({ uid }));
      setCustomUserClaimsStub
        .withArgs(uid, { role: data.role })
        .returns(Promise.resolve());

      const wrapped = test.wrap(myFunctions.default);

      wrapped(data, context);
    });

    it('Should send new email if user already exists', () => {

    });
  });
});
