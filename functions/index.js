const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Roles to define what permissons a given user has
 */
const ROLES = {
  ADMIN: 'ADMIN',
  DEFAULT: 'DEFAULT'
};

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function createProfile(userRecord, context) {
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .set({
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      email: userRecord.email
    })
    .catch(console.error);

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
      roles: [ROLES.DEFAULT]
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
    createRoles(userRecord, context);
    return createProfile(userRecord, context);
  }),
  authOnDelete: functions.auth.user().onDelete((userRecord, context) => {
    deleteRoles(userRecord, context);
    return deleteProfile(userRecord, context);
  })
};
