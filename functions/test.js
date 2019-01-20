const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');


try { admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-74eb3.firebaseio.com/'
}) } catch (e) { console.log(e) }

const db = admin.firestore();

const promise = db.collection('Users').where('email', '==', 'kmurf1999@gmail.com').get().then(snap => snap.docs[0]).then(doc => {
  console.log(doc.data());
  console.log(doc.id);
});
