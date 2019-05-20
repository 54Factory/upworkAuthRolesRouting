const functions = require('firebase-functions');
const admin = require('firebase-admin');


function initApp() {
  try { admin.initializeApp() } catch (e) {}
}
exports.initApp = initApp;

/**
 * Helper function to log errors
 */
function logError(name, error) {
  return admin.firestore()
    .collection('Logs').add({
      function_name: name,
      created_on: new Date().getTime(),
      error_message: error.message
    });
}
exports.logError = logError;
