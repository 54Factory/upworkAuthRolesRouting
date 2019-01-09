const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const welcome = require('./emailTemplates/welcome');

admin.initializeApp();

const db = admin.firestore();

db.settings({
  timestampsInSnapshots: true
});

/**
 * Roles to define what permissons a given user has
 */
const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER'
};

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function createProfile(userRecord, context) {
  console.log(context);
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .set({
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      email: userRecord.email
    })
    .catch(console.error);

}

/**
 * Creates a document with ID -> uid in the 'Roles' collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function createRoles(userRecord, context) {
  return db
    .collection('Roles')
    .doc(userRecord.uid)
    .set({
      roles: [ROLES.DEFAULT]
    })
    .catch(console.error);

}

/**
 * Delete user document with ID -> uid in the 'Users collection'.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function deleteProfile(userRecord, context) {
  return db
    .collection('Users')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
};

/**
 * deletes a document with ID -> uid in the 'Roles' collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
function deleteRoles(userRecord, context) {
  return db
    .collection('Roles')
    .doc(userRecord.uid)
    .delete()
    .catch(console.error);
}

/** Sends a welcome email
 *
 * @param {Object} userRecord Contains the uid and email
 * @param {Object} context Details about the event.
 */
function sendWelcomeEmail(userRecord, context) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //nodemailer.createTestAccount((err, account) => {
  //  // create reusable transporter object using the default SMTP transport
  //  let transporter = nodemailer.createTransport({
  //      host: 'smtp.ethereal.email',
  //      port: 587,
  //      secure: false, // true for 465, false for other ports
  //      auth: {
  //          user: account.user, // generated ethereal user
  //          pass: account.pass // generated ethereal password
  //      }
  //  });
  //  // setup email data with unicode symbols
  //  let mailOptions = {
  //      from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //      to: userRecord.email, // list of receivers
  //      subject: 'Welcome to _', // Subject line
  //      text: welcome.text, // plain text body
  //      html: welcome.html// html body
  //  };
  //  // send mail with defined transport object
  //  transporter.sendMail(mailOptions, (error, info) => {
  //      if (error) {
  //          return console.log(error);
  //      }
  //      console.log('Message sent: %s', info.messageId);
  //      // Preview only available when sending through an Ethereal account
  //      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  //  });
  //});
}

module.exports = {
  authOnCreate: functions.auth.user().onCreate((userRecord, context) => {
    createRoles(userRecord, context);
    createProfile(userRecord, context);
    sendWelcomeEmail(userRecord, context);
    return 200;
  }),
  authOnDelete: functions.auth.user().onDelete((userRecord, context) => {
    deleteRoles(userRecord, context);
    deleteProfile(userRecord, context);
    return 200;
  })
};
