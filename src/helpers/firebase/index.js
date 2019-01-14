import firebase from 'firebase';
import ReduxSagaFirebase from 'redux-saga-firebase';
import { buffers, eventChannel } from 'redux-saga';
import 'firebase/firestore';
import { firebaseConfig } from '../../settings';

const valid =
  firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId;

const firebaseApp =
  valid && process.env.NODE_ENV === 'test'
  ? firebase.initializeTestApp(firebaseConfig)
  : firebase.initializeApp(firebaseConfig);

const firebaseAuth = valid && firebase.auth;

class FirebaseHelper {
  isValid = valid;
  constructor() {
    // bind methods
    this.createUser = this.createUser.bind(this);
    this.handleAuthError = this.handleAuthError.bind(this);
    this.channel = this.channel.bind(this);

    this.database = this.isValid && firebase.firestore();
    this.rsfAuth = firebaseAuth;
    this.rsf =
      this.isValid && new ReduxSagaFirebase(firebaseApp, firebase.firestore());
    this.rsfFirestore = this.isValid && this.rsf.firestore;

    // new timestamp settings for firestore
    firebase.firestore().settings({ timestampsInSnapshots: true });
  }

  /**
   * Invokes 'createUser' cloud function
   * must be logged in as an admin to call
   * @param {Object} userInfo
   * @param {String} userInfo.email
   * @param {String} userInfo.role - 'DRIVER' or 'CUSTOMER'
   * @param {String} userInfo.displayName
   * @returns {Object} { err, json }
   */
  createUser(userInfo) {
    //const testUrl = 'http://localhost:5000/test-74eb3/us-central1/createUser';
    const url = `${process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS}/createUser`;
    this.rsfAuth().currentUser.getIdToken(true).then(token => {
      fetch(url, {
        method: 'post',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          token,
          userInfo
        })
      })
        .then(res => res.json())
        .then(json => {
          return { err: null, json };
        })
        .catch(err => {
          return { err, json: null };
        })
    }).catch(err => {
      return { err, json: null };
    });
  }

  /**
   * Creates channel for firestore collection or document
   * @param pathorRef {String} - path to document or collection
   * @param type {String} - collection or document
   * @param buffer {buffer}
   * returns channel
   */
  channel(
    pathOrRef,
    type = 'collection',
    buffer = buffers.none()
  ) {
    const ref = type === 'collection'
      ? this.database.collection(pathOrRef)
      : this.database.doc(pathOrRef);
    const channel = eventChannel(emit => ref.onSnapshot(val => {
      emit({ val, err: null });
    }, err => {
      emit({ val: null, err });
    }), buffer);
    return channel;
  }

  /**
   * handles google auth errors and returns a more readable error message
   * @param {Object} error 
   */
  handleAuthError(error) {
    let errorMessage;
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid Email';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Wrong Email or Password';
        break;
      case 'auth/user-disabled':
        errorMessage = 'User has been disabled';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'A User with that email already exists';
        break;
      case 'auth/weak-password':
        errorMessage = 'Your password is too weak';
        break;
      default:
        errorMessage = 'Authentication Error';
        break;
    }
    return errorMessage;
  }
}

export default new FirebaseHelper();
