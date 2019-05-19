const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * On delete, un-index from algolia
 */
exports.default = functions.firestore
  .document('Users/{userId}').onDelete((snap, context) => {

  });
