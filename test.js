const firebase = require('firebase');

const firebaseConfig = {
  projectId: 'test-74eb3',
  authDomain: 'test-74eb3.firebaseapp.com',
  databaseURL: 'https://test-74eb3.firebaseio.com/',
  apiKey: 'AIzaSyBY3GoyXaef8VHNiZ4i-r251bjQNEDmEzY'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

firebase.auth().signInWithEmailAndPassword('test@gmail.com', 'Ruffers39');

firebase.auth().onAuthStateChanged((user, err) => {
  if (user) {
    db.collection('Users').doc(user.uid).onSnapshot(doc => {
      console.log(doc.data());
    }, err => {
      console.log('ERR');
    });
  } else if (err) {
    console.log(err);
  }
});

setTimeout(() => {
  firebase.auth().signOut();
}, 20000);



