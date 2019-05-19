const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * On create, add index to algolia
 */
exports.default = functions.firestore
  .document('Users/{userId}')
  .onCreate((snap, context) => {

  });
