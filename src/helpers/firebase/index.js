import firebase from 'firebase';
import ReduxSagaFirebase from 'redux-saga-firebase';
import 'firebase/firestore';
import { firebaseConfig } from '../../settings';

const valid =
  firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId;

const firebaseApp = valid && firebase.initializeApp(firebaseConfig);
// const firebaseAuth = valid && firebase.auth;

class FirebaseHelper {
  isValid = valid;
  // EMAIL = 'email';
  // FACEBOOK = 'facebook';
  // GOOGLE = 'google';
  // GITHUB = 'github';
  // TWITTER = 'twitter';
  constructor() {
    this.handleAuthError = this.handleAuthError.bind(this);
    // this.login = this.login.bind(this);
    // this.logout = this.logout.bind(this);
    // this.isAuthenticated = this.isAuthenticated.bind(this);
    // this.getUser = this.getUser.bind(this);
    this.database = this.isValid && firebase.firestore();
    // if (this.database) {
    //   const settings = { timestampsInSnapshots: true };
    //   this.database.settings(settings);
    // }
    this.rsf =
      this.isValid && new ReduxSagaFirebase(firebaseApp, firebase.firestore());
    this.rsfFirestore = this.isValid && this.rsf.firestore;
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
