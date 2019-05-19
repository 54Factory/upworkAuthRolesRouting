const functions = require('firebase-functions');
const admin = require('firebase-admin');

const tools = require('../helper_functions');

try { admin.initializeApp(); } catch (e) { console.log(e); }

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
exports.default = functions.auth.user().onDelete((userRecord, context) => {
  // Remove user from users collection
  const user = admin.firestore().collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(err => {
      tools.logError('authOnDelete', err);
      console.log(err);
    });

  return user;
});
