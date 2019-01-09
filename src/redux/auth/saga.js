import { call, all, takeEvery, take, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import firebaseHelper from '../../helpers/firebase';
import actions from './actions';
import notification from '../../components/notification';


/**
 * Creates new user on SIGNUP_REQUEST
 */
export function* watchSignupRequest() {
  yield takeEvery(actions.SIGNUP_REQUEST, signupRequest);
}
export function* signupRequest(action) {
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
}

/**
 * Creates notification on signup error
 */
export function* watchSignupError() {
  yield takeEvery(actions.SIGNUP_ERROR, signupError);
}
export function* signupError(action) {
  yield call(notification, 'error', 'Error', action.error);
}

/**
 * Login to firebase on LOGIN_REQUEST
 */
export function* watchLoginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, loginRequest);
}
export function* loginRequest(action) {
  try {
    let provider;
    let method;
    switch(action.provider) {
      case 'email':
        provider = new firebaseHelper.rsfAuth.EmailAuthProvider();
        method = firebaseHelper.rsf.auth.signInWithEmailAndPassword;
        yield call(method, action.info.email, action.info.password);
        break;
      case 'google':
        provider = new firebaseHelper.rsfAuth.GoogleAuthProvider();
        method = firebaseHelper.rsf.auth.signInWithPopup;
        yield call(method, provider);
        break;
      case 'facebook':
        provider = new firebaseHelper.rsfAuth.FacebookAuthProvider();
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
}

/**
 * Notify user on LOGIN_SUCCESS
 * push user to dashboard after login
 */
export function* watchLoginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, loginSuccess);
}
export function* loginSuccess(action) {
  yield call(notification, 'success', 'Success', `Logged in as ${action.authUser.email}.`);
  yield put(push('/dashboard'));
}

/**
 * Notify user on login error
 */
export function* watchLoginError() {
  yield takeEvery(actions.LOGIN_ERROR, loginError);
}
export function* loginError(action) {
  yield call(notification, 'error', 'Error', action.error);
}

/**
 * Logout of firebase
 */
export function* watchLogout() {
  yield takeEvery(actions.LOGOUT, logout);
}
export function* logout() {
  try {
    yield call(firebaseHelper.rsf.auth.signOut);
    yield put(push('/'));
    yield call(notification, 'success', 'Success', 'Successfully Logged out.');
  } catch (e) {
    // logout error
  }
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

/**
 * Sends password reset on RESET_PASSWORD_REQUEST
 * @return {Action} RESET_PASSWORD_SUCCESS or RESET_PASSWORD_ERROR
 */
export function* watchResetPasswordRequest()  {
  yield takeEvery(actions.RESET_PASSWORD_REQUEST, resetPasswordRequest);
}
export function* resetPasswordRequest(action) {
  try {
    const actionCodeSettings = {};
    yield call(
      firebaseHelper.rsf.auth.sendPasswordResetEmail,
      action.email,
      actionCodeSettings
    );
    yield put({
      type: actions.RESET_PASSWORD_SUCCESS,
      email: action.email
    });
  } catch (err) {
    yield put({
      type: actions.RESET_PASSWORD_ERROR,
      error: firebaseHelper.handleAuthError(err)
    });
  }
}

/**
 * Notifies user on password reset error
 */
export function* watchResetPasswordError() {
  yield takeEvery(actions.RESET_PASSWORD_ERROR, resetPasswordError);
}
export function* resetPasswordError(action) {
  yield call(notification, 'error', 'Error', action.error);
}

/**
 * Notify user on password reset success
 */
export function* watchResetPasswordSuccess() {
  yield takeEvery(actions.RESET_PASSWORD_SUCCESS, resetPasswordSuccess);
}
export function* resetPasswordSuccess(action) {
  yield call(notification, 'success', 'Success', `Password reset email sent to ${action.email}.`);
  yield put(push('/signin'));
}

export default function* rootSaga() {
  yield all([
    fork(watchSignupRequest),
    fork(watchSignupError),
    fork(watchLoginRequest),
    fork(watchLoginSuccess),
    fork(watchLoginError),
    fork(watchLogout),
    fork(syncAuthUser),
    fork(watchResetPasswordRequest),
    fork(watchResetPasswordError),
    fork(watchResetPasswordSuccess)
  ]);
}
