import firebase from 'firebase';
import ReduxSagaFirebase from 'redux-saga-firebase';
import 'firebase/firestore';
import { firebaseConfig } from '../../settings';

const valid =
  firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId;

const firebaseApp = valid && firebase.initializeApp(firebaseConfig);
const firebaseAuth = valid && firebase.auth;

class FirebaseHelper {
  isValid = valid;
  constructor() {
    this.handleAuthError = this.handleAuthError.bind(this);
    this.database = this.isValid && firebase.firestore();
    this.rsfAuth = firebaseAuth;
    this.rsf =
      this.isValid && new ReduxSagaFirebase(firebaseApp, firebase.firestore());
    this.rsfFirestore = this.isValid && this.rsf.firestore;
    firebase.firestore().settings({ timestampsInSnapshots: true });
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
