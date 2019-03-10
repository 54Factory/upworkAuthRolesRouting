const functions = require('firebase-functions');
const admin = require('firebase-admin');

try { admin.initializeApp() } catch (e) {}

/**
 * Helper function to log errors
 */
function logError(name, error) {
  console.log(error);
  return admin.firestore()
    .collection('Logs').add({
      function_name: name,
      created_on: new Date().getTime(),
      error_message: error.message
    });
}
exports.logError = logError;
