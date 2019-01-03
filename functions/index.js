const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Roles to define what permissons a given user has
 */
const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * create user with Default ROLE,
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord, context) => {
  db
    .collection('Roles')
    .doc(userRecord.uid)
    .set({
      roles: [ROLES.USER]
    })
    .catch(console.error);
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .set({
      email: userRecord.email
    })
    .catch(console.error);
};

/**
 * Delete user document with ID -> uid in the 'Users collection'.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const deleteProfile = (userRecord, context) => {
  db
    .collection('Roles')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  authOnDelete: functions.auth.user().onDelete(deleteProfile)
};
