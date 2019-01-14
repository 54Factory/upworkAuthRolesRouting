const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const welcome = require('./emailTemplates/welcome');

admin.initializeApp();

const db = admin.firestore();

db.settings({
  timestampsInSnapshots: true
});

/**
 * Roles to define what permissons a given user has
 */
const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER'
};


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
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function onCreate(userRecord, context) {
  // create custom claims to set user role
  // TODO set call function differently to set role
  admin.auth().setCustomUserClaims(userRecord.uid, { role: ROLES.ADMIN }).then(() => {
    // Create new user in Users collection
    return db.collection('Users')
      .doc(userRecord.uid)
      .set({
        created_on: new Date().getTime(),
        updated_on: new Date().getTime(),
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        email: userRecord.email
      })
      .catch(console.error);
  }).catch(error => {
    console.log(error);
  });
}

/**
 * Delete user document with ID -> uid in the 'Users collection'.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function onDelete(userRecord, context) {
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
};

/**
 * REST endpoint to create new user
 * ADMIN can call this method to create a new user and send them an email
 * @method POST
 * @param {HTTP request} req
 * @param {HTTP response} res
 * @param {String} req.body.token - user who called function's token
 * @param {Object} req.body.userInfo - info to create new user with
 * @param {String} req.body.userInfo.role - new user's role
 * @param {String} req.body.userInfo.email
 * @param {String} req.body.userInfo.displayName
 */
function createUser(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'application/json');

  const { token, userInfo: { email, displayName, role }} = req.body;

  // check if bad role
  if (!['DRIVER', 'CUSTOMER'].includes(role))
    return res.status(422);

  // if token or userInfo not in body
  if (!token) return res.status(422);
  if (!email) return res.status(422);
  if (!displayName) return res.status(422);

  // create password
  const password = generatePassword();

  admin.auth().verifyIdToken(token).then(user => {
    // if not admin
    if (user.role !== 'ADMIN')
      return res.status(401);

    // create user with random password
    admin.auth().createUser({
      email,
      displayName,
      password
    }).then(userRecord => {
      // set custom claims
      admin.auth().setCustomUserClaims(userRecord.uid, { role }).then(() => {
        // send email to new user
        return res.status(200).json(userRecord);
      }).catch(err => {
        // catch claims error
        return res.status(500).json(err);
      });
    }).catch(err => {

      return res.status(500).json(err);
    });
  }).catch(err => {
    // Bad Token
    return res.status(409).json(err);
  });
}

module.exports = {
  authOnCreate: functions.auth.user().onCreate((userRecord, context) => {
    onCreate(userRecord, context);
    //    sendWelcomeEmail(userRecord, context);
    return 200;
  }),
  authOnDelete: functions.auth.user().onDelete((userRecord, context) => {
    onDelete(userRecord, context);
    return 200;
  }),
  createUser: functions.https.onRequest(createUser)
};
