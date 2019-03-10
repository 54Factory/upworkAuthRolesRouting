const functions = require('firebase-functions');
const admin = require('firebase-admin');

try { admin.initializeApp() } catch (e) {}

const tools = require('../helper_functions');
const mailer = require('../email');
const inviteTemplate = require('../email/templates/invite');

const roles = [
  'ADMIN',
  'CUSTOMER',
  'DRIVER'
];

/**
 * Helper function to create random string
 */
function generatePassword() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
exports.generatePassword = generatePassword;



/**
 * Sends an invite email with the link to signup
 * @param {String} display_name
 * @param {String} email - email to send to
 * @param {uid} id - setup link id
 * @returns {Promise} nodemailer send mail promise
 */
function sendInvite(display_name, email, id) {
  const msg = inviteTemplate({
    display_name, email,
    url: `${functions.config().client.url}/invite?id=${id}`
  });

  const args = {
    from: functions.config().email.auth.user,
    to: email,
    subject: 'Welcome to Eden Green',
    text: msg.text,
    html: msg.html
  };

  return mailer.sendEmail(args);
}
exports.sendInvite = sendInvite;

/**
 * @param {String} id - user id
 * @param {String} password - randomly generated password
 * @returns {firestore document}
 */
function createSetupLink(id, password) {
  return admin.firestore().collection('SetupLinks')
    .add({
      uid: id,
      created_on: new Date().getTime(),
      expires_on: new Date().getTime() + 86400000,
      temp_password: password, // fine because only admin can directly access this
      valid: true
    })
    .then(ref => ref.get())
    .catch(err => {
      tools.logError('createUser', err);
      throw new functions.HttpsError(
        'internal',
        err.message
      );
    });
}
exports.createSetupLink = createSetupLink;

/**
 * Given a user id, remove all existing setup links
 * @param {uid} user id
 */
function removeOldLinks(id) {
  let promises = [];
  return admin.firestore().collection('SetupLinks')
    .where('uid', '==', id)
    .get()
    .then(snap => snap.forEach(doc => {
      promises.push(
        admin.firestore().collection('SetupLinks').doc(doc.id).delete()
      );
    }))
    .then(() => Promise.all(promises))
    .catch(err => {
      tools.logError('createUser', err);
      throw new functions.HttpsError(
        'internal',
        err.message
      );
    });
}
exports.removeOldLinks = removeOldLinks;

/**
 * Https method to create new user
 * Must be an admin to call
 */
exports.default = functions.https.onCall((data, context) => {
  const email = data.email || null;
  const display_name = data.display_name || null;
  const role = data.role || null;

  if (context.auth.token.role !== 'ADMIN')
    throw new functions.https.HttpsError(
      'permission-denied',
      'Must be an admin to call this function'
    );

  if (!roles.includes(role))
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid role'
    );

  if (!email || typeof email !== 'string')
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid email'
    );

  // create password for user
  const password = generatePassword();

  // create user
  return admin.auth().createUser({
    email,
    displayName: display_name,
    password
  })
  .then(userRecord => {
    // set custom claims
    admin.auth().setCustomUserClaims(userRecord.uid, { role }).then(() => {
      admin.firestore().collection('Users')
        .doc(userRecord.uid)
        .set(Object.assign({
          created_on: new Date().getTime(),
          updated_on: new Date().getTime(),
          profile_picture: null,
          email_verified: false,
        }, data));
    });
    // create setup link
    return createSetupLink(userRecord.uid, password)
      .then(doc => sendInvite(display_name, email, doc.id));
  })
  .catch(err => {
    // Most likely user already exists error
    return admin.firestore().collection('Users').where('email', '==', email)
      .get()
      .then(snap => snap.docs[0])
      .then(doc => doc.id)
      .then(id => removeOldLinks(id)
      .then(() => createSetupLink(id, password)))
      .then(doc => sendInvite(display_name, email, doc.id))
      .catch(err => {
        tools.logError('createUser', err);
        throw new functions.https.HttpsError(
          'internal',
          err.message
        );
      });
  });
});

