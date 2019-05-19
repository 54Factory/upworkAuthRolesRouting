import firebase from 'firebase/app';
import ReduxSagaFirebase from 'redux-saga-firebase';
import { buffers, eventChannel } from 'redux-saga';
import uuidv1 from 'uuid/v1';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
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
    this.handleAuthError = this.handleAuthError.bind(this);
    this.channel = this.channel.bind(this);

    this.createCustomer = this.createCustomer.bind(this);

    this.functions = this.isValid && firebase.functions();
    this.database = this.isValid && firebase.firestore();
    this.storage = this.isValid && firebase.storage();
    this.storageRef = this.storage.ref();
    this.imageRef = this.storageRef.child('images');

    this.rsfAuth = firebaseAuth;
    this.rsf =
      this.isValid && new ReduxSagaFirebase(firebaseApp, firebase.firestore());
    this.rsfFirestore = this.isValid && this.rsf.firestore;

    // new timestamp settings for firestore
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

  uploadImage(file, metadata, onError, onProgress, onSuccess) {
    // generate a unique id for the photo
    const uuid = uuidv1();
    const uploadTask = this.imageRef.child(uuid).put(file, metadata);
    const userId = this.rsfAuth().currentUser.uid;

    uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    }, err => {
      onError(err);
    }, () => {
      // on success
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        this.database.collection('Images').doc(uuid).set({
          metadata,
          owner: userId,
          url: downloadURL,
          thumb_url: null
        }).then(() => {
          onSuccess(downloadURL, uuid);
        }).catch(err => {
          onError(err);
        })
      });
    });
  }

  /**
   * Creates a new customer document in firestore
   * currently does not link to userId
   * or, to locations, that is done later
   * @param {String} name - name of customer
   * @returns {Promise}
   */
  createCustomer({ name }) {
    //const newCustomer = {
    //  name, // name of customer
    //  createdOn: new Date(), // current date
    //  active: true // default true
    //};

  }
}

export default new FirebaseHelper();
