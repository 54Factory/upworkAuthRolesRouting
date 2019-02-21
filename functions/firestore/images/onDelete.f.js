const functions = require('firebase-functions');
const admin = require('firebase-admin');
const storage = admin.storage();

/**
 * On delete, remove image from storage bucket
 */
exports.default = functions.firestore
  .document('Images/{imageId}').onDelete((snap, context) => {
    const imageId = context.params.imageId;
    return storage.ref().child(`/images/${imageId}`)
      .delete()
  });

