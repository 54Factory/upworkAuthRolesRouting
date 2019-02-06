const functions = require('firebase-functions');
const admin = require('firebase-admin');

const mailer = require('../email');
const inviteTemplate = require('../email/templates/invite');

// try { admin.initializeApp() } catch (e) { console.log(e) }

const db = admin.firestore();

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

function sendInvite(displayName, email, id) {
  const msg = inviteTemplate({
    displayName, email,
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
 * @returns {firestore document}
 */
function createSetupLink(id, password) {
  return db.collection('SetupLinks')
    .add({
      uid: id,
      created_on: new Date().getTime(),
      expires_on: new Date().getTime() + 86400000,
      temp_password: password, // fine because only admin can directly access this
      valid: true
    })
    .then(ref => ref.get());
}
exports.createSetupLink = createSetupLink;

/**
 * Given a user id, remove all existing setup links
 * @param {uid} user id
 */
function removeOldLinks(id) {
  let promises = [];
  return db.collection('SetupLinks')
    .where('uid', '==', id)
    .get()
    .then(snap => snap.forEach(doc => {
      promises.push(
        db.collection('SetupLinks').doc(doc.id).delete()
      );
    }))
    .then(() => Promise.all(promises))
    .catch(err => {
      throw err;
    });
}
exports.removeOldLinks = removeOldLinks;

/**
 * Https method to create new user
 * Must be an admin to call
 */
exports.default = functions.https.onCall((data, context) => {
  const email = data.email || null;
  const displayName = data.displayName || null;
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
    displayName,
    password
  })
  .then(userRecord => {
    // set custom claims
    admin.auth().setCustomUserClaims(userRecord.uid, { role }).then(() => {
      db.collection('Users')
        .doc(userRecord.uid)
        .set(Object.assign({
          created_on: new Date().getTime(),
          updated_on: new Date().getTime(),
          profile_picture: null,
          email_verified: false,
          completed_signup: false
        }, data));
    });
    // create setup link
    return createSetupLink(userRecord.uid, password)
      .then(doc => sendInvite(displayName, email, doc.id));
  })
  .catch(err => {
    console.log(err);
    // Most likely user already exists error
    return db.collection('Users').where('email', '==', email)
      .get()
      .then(snap => snap.docs[0])
      .then(doc => doc.id)
      .then(id => removeOldLinks(id)
      .then(() => createSetupLink(id, password)))
      .then(doc => sendInvite(displayName, email, doc.id))
      .catch(err => {
        throw err;
      });
  });
});

