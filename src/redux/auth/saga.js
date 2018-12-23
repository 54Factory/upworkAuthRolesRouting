import { call, all, takeEvery, take, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
// import { getToken, clearToken, getCredential, clearCredential } from '../../helpers/utility';
import firebaseHelper from '../../helpers/firebase';
import actions from './actions';
import notification from '../../components/notification';

import firebase from 'firebase';

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
  })
}

export function* signupError() {
  yield takeEvery(actions.SIGNUP_ERROR, function*(payload) {
    yield call(notification, 'error', payload.error);
  });
}

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

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield call(notification, 'success', `Logged in as ${payload.user.email}`);
    yield put(push('/dashboard'));
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*(payload) {
    yield call(notification, 'error', payload.error);
  });
}

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

export function* syncUser() {
  const channel = yield call(firebaseHelper.rsf.auth.channel);

  while(true) {
    const { error, user } = yield take(channel);

    if (user) yield put({
      type: actions.LOGIN_SUCCESS,
      user
    });
    else if (error) yield put({
      type: actions.LOGIN_ERROR,
      error: firebaseHelper.handleAuthError(error)
    });
  }
}

export default function* rootSaga() {
  yield all([
    fork(signupRequest),
    fork(signupError),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(syncUser),
  ]);
}
