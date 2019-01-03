import { call, all, takeEvery, take, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import firebaseHelper from '../../helpers/firebase';
import actions from './actions';
import notification from '../../components/notification';


/**
 * Sends password reset on RESET_PASSWORD_REQUEST
 * @return {Action} RESET_PASSWORD_SUCCESS or RESET_PASSWORD_ERROR
 */
export function* resetPasswordRequest() {
  yield takeEvery(actions.RESET_PASSWORD_REQUEST, function*(action) {
    try {
      const actionCodeSettings = {};
      yield call(
        firebaseHelper.rsf.auth.sendPasswordResetEmail,
        action.email,
        actionCodeSettings
      );
      yield put({
        type: actions.RESET_PASSWORD_SUCCESS
      });
    } catch (err) {
      yield put({
        type: actions.RESET_PASSWORD_ERROR,
        error: firebaseHelper.handleAuthError(err)
      });
    }
  });
}

/**
 * Notifies user on password reset error
 */
export function* resetPasswordError() {
  yield takeEvery(actions.RESET_PASSWORD_ERROR, function*(payload) {
    yield call(notification, 'error', payload.error);
  });
}

/**
 * Notify user on password reset success
 */
export function* resetPasswordSuccess() {
  yield takeEvery(actions.RESET_PASSWORD_SUCCESS, function*(payload) {
    yield call(notification, 'success', 'Password reset');
  });
  yield put(push('/signin'));
}

/**
 * Creates new user on SIGNUP_REQUEST
 */
export function* signupRequest() {
  yield takeEvery(actions.SIGNUP_REQUEST, function*(action) {
    try {
      const { email, password } = action.info;
      yield call(
        firebaseHelper.rsf.auth.createUserWithEmailAndPassword,
        email,
        password);
    } catch (err) {
      yield put({
        type: actions.SIGNUP_ERROR,
        error: firebaseHelper.handleAuthError(err)
      });
    }
  });
}

export function* signupError() {
  yield takeEvery(actions.SIGNUP_ERROR, function*(payload) {
    yield call(notification, 'error', payload.error);
  });
}

/**
 * Login to firebase on LOGIN_REQUEST
 */
export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function*(action) {
    try {
      let provider;
      let method;
      switch(action.provider) {
        case 'email':
          provider = new firebase.auth.EmailAuthProvider();
          method = firebaseHelper.rsf.auth.signInWithEmailAndPassword;
          yield call(method, action.info.email, action.info.password);
          break;
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          method = firebaseHelper.rsf.auth.signInWithPopup;
          yield call(method, provider);
          break;
        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider();
          method = firebaseHelper.rsf.auth.signInWithPopup();
          yield call(method, provider);
          break;
        default: break;
      }
      // successful login will trigger the syncUser, which will update the state
    } catch (err) {
      yield put({
        type: actions.LOGIN_ERROR,
        error: firebaseHelper.handleAuthError(err)
      });
    }
  });
}

/**
 * Notify user on LOGIN_SUCCESS
 * push user to dashboard after login
 */
export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield call(notification, 'success', `Logged in as ${payload.authUser.email}`);
    yield put(push('/dashboard'));
  });
}

/**
 * Notify user on login error
 */
export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*(payload) {
    yield call(notification, 'error', payload.error);
  });
}

/**
 * Logout of firebase
 */
export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    try {
      yield call(firebaseHelper.rsf.auth.signOut);
      yield put(push('/'));
      yield call(notification, 'success', 'Successfully Logged out');
    } catch (e) {
      // logout error
    }
  });
}

/**
 * Update user info when user changes
 */
export function* syncAuthUser() {
  const channel = yield call(firebaseHelper.rsf.auth.channel);

  while(true) {
    const { error, user } = yield take(channel);
    if (user) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        authUser: user
      });
    } else if (error) {
      yield put({
        type: actions.LOGIN_ERROR,
        error: firebaseHelper.handleAuthError(error)
      });
    }
  }
}

export default function* rootSaga() {
  yield all([
    fork(resetPasswordRequest),
    fork(resetPasswordError),
    fork(resetPasswordSuccess),
    fork(signupRequest),
    fork(signupError),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(syncAuthUser),
  ]);
}
