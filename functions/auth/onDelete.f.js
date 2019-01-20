const functions = require('firebase-functions');
const admin = require('firebase-admin');

// try { admin.initializeApp(); } catch (e) { console.log(e); }

const db = admin.firestore();

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
exports = module.exports = functions.auth.user().onDelete((userRecord, context) => {
  let promises = [];
  // Create new user in Users collection
  const user = db.collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);

  promises.push(user);

  return Promise.all(promises);
});
