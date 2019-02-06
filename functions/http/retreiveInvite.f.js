const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Given a valid setup link id return a user credential
 */
exports.default = functions.https.onCall((data, content) => {
  const inviteId = data.inviteId || null;

  if (!inviteId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'No invite id specified'
    );
  }

  const inviteRef = db.collection('SetupLinks').doc(inviteId);

  return inviteRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();

      if (new Date().getTime() > data.expires_on || !data.valid) {
        throw new functions.https.HttpsError(
          'deadline-exceeded',
          'Invite has expired'
        );
      } else {
        return admin.auth().getUser(data.uid)
          .then(user => {
            return firebase.auth.EmailAuthProvider
              .credential(user.email, data.temp_password);
          })
          .catch(err => {
            throw new functions.https.HttpsError(
              'internal',
              'Internal server error'
            );
          });
      }
    } else {
      throw new functions.https.HttpsError(
        'not-found',
        'Invite does not exist'
      );
    }
  });
});
