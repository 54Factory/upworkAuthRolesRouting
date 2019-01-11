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
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function createProfile(userRecord, context) {
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
 * Creates a document with ID -> uid in the 'Roles' collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function createRoles(userRecord, context) {
  return db
    .collection('Roles')
    .doc(userRecord.uid)
    .set({
      hasDeclaredRole: false
    })
    .catch(console.error);

}

/**
 * Delete user document with ID -> uid in the 'Users collection'.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function deleteProfile(userRecord, context) {
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
};

/**
 * deletes a document with ID -> uid in the 'Roles' collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function deleteRoles(userRecord, context) {
  return db
    .collection('Roles')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
}

module.exports = {
  authOnCreate: functions.auth.user().onCreate((userRecord, context) => {
    //createRoles(userRecord, context);
    createProfile(userRecord, context);
    //    sendWelcomeEmail(userRecord, context);
    return 200;
  }),
  authOnDelete: functions.auth.user().onDelete((userRecord, context) => {
    //    deleteRoles(userRecord, context);
    deleteProfile(userRecord, context);
    return 200;
  })
};
