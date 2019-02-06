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
exports.default = functions.auth.user().onCreate((userRecord, context) => {
  let promises = [];
  /**
   * Test code to create admin
   */
  if (userRecord.email === 'admin@admin.co') {
    const newAdmin = admin.auth().setCustomUserClaims(userRecord.uid, { role: 'ADMIN' })

    console.log(`Admin ${userRecord.uid} created`);

    promises.push(newAdmin);

    // Create new user in Users collection
    const user = db.collection('Users')
      .doc(userRecord.uid)
      .set({
        role: 'ADMIN',
        created_on: new Date().getTime(),
        updated_on: new Date().getTime(),
        displayName: userRecord.displayName,
        email: userRecord.email
      })
      .catch(console.error);

    promises.push(user);
  }


  return Promise.all(promises);
});
