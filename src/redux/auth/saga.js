import { call, all, takeEvery, take, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import firebaseHelper from '../../helpers/firebase';
import actions from './actions';
import appActions from '../app/actions';
import { message } from 'antd';

/**
 * Login to firebase on LOGIN_REQUEST
 */
export function* watchLoginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, loginRequest);
}
export function* loginRequest(action) {
  try {
    let credential;
    const method = firebaseHelper.rsf.auth.signInAndRetrieveDataWithCredential;
    switch(action.provider) {
      case 'email':
        credential = firebaseHelper
          .rsfAuth
          .EmailAuthProvider
          .credential(action.info.email, action.info.password);

        yield call(method, credential);
        break;
        //      case 'google':
        //        credential = firebaseHelper.rsfAuth.GoogleAuthProvider.credential;
        //        yield call(method, credential);
        //        break;
        //      case 'facebook':
        //        credential = firebaseHelper.rsfAuth.FacebookAuthProvider.credential;
        //        yield call(method, credential);
        //        break;
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
  if (window) window.localStorage.setItem('loggedIn', true);
  yield put({
    type: appActions.SET_LOADING,
    loading: false
  });
  yield call(message.success, `Logged in as ${action.authUser.email}.`);
}

/**
 * Notify user on login error
 */
export function* watchLoginError() {
  yield takeEvery(actions.LOGIN_ERROR, loginError);
}
export function* loginError(action) {
  yield call(message.error, action.error);
}

/**
 * Logout of firebase
 */
export function* watchLogout() {
  yield takeEvery(actions.LOGOUT, logout);
}
export function* logout() {
  if (window) window.localStorage.removeItem('loggedIn');
  try {
    yield call(firebaseHelper.rsf.auth.signOut);
    yield put(push('/'));
    yield call(message.success, 'Successfully Logged out.');
  } catch (e) {
    // logout error
  }
}

/**
 * Helper function to get role from user
 * @param user {object} - firebase user object
 * @returns role one of "ADMIN" "CUSTOMER" "DRIVER"
 */
function getRole(user) {
  return user.getIdToken(true).then(async () => {
    const token = await user.getIdTokenResult();
    return token.claims.role;
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
      const role = yield call(getRole, user);
      const profile_picture = yield call(firebaseHelper.profilePic);
      // update redux state
      yield put({
        type: actions.LOGIN_SUCCESS,
        authUser: user,
        role,
        profile_picture
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
  yield call(message.error, action.error);
}

/**
 * Notify user on password reset success
 */
export function* watchResetPasswordSuccess() {
  yield takeEvery(actions.RESET_PASSWORD_SUCCESS, resetPasswordSuccess);
}
export function* resetPasswordSuccess(action) {
  yield call(message.success, `Password reset email sent to ${action.email}.`);
  yield put(push('/signin'));
}

export default function* rootSaga() {
  yield all([
    //    fork(watchSignupRequest),
    //    fork(watchSignupError),
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
