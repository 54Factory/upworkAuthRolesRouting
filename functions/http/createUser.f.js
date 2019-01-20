const functions = require('firebase-functions');
const admin = require('firebase-admin');

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

/**
 * Https method to create new user
 * Must be an admin to call
 */
exports = module.exports = functions.https.onCall((data, context) => {
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
    admin.auth().setCustomUserClaims(userRecord.uid, { role });
    // create setup link
    return createSetupLink(userRecord.uid);
  })
  .catch(err => {
    console.log(err);
    // Most likely user already exists error
    return db.collection('Users').where('email', '==', email)
      .get()
      .then(snap => snap.docs[0])
      .then(doc => doc.id)
      .then(id => {
        return removeOldLinks(id).then(() => createSetupLink(id));
      })
      .catch(err => {
        throw err;
      });
  });
});

function createSetupLink(id) {
  return db.collection('SetupLinks')
    .add({
      uid: id,
      created_on: new Date().getTime(),
      expires_on: new Date().getTime() + 86400000,
      valid: true
    })
    .then(ref => ref.get()
    .then(doc => doc.data()));
}

function removeOldLinks(id) {
  let promises = [];
  return db.collection('SetupLinks')
    .where('uid', '==', id)
    .get()
    .then(snap => snap.forEach(doc => {
      promises.push(doc.ref.update({
        valid: false
      }));
      return Promise.all(promises);
    }))
    .catch(err => {
      throw err;
    });
}
