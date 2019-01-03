import { select, call, all, takeLatest, takeEvery, take, put, fork } from 'redux-saga/effects';
//import { push } from 'react-router-redux';
import firebaseHelper from '../../helpers/firebase';
import actions from './actions';
import authActions from '../auth/actions';

/**
 * Syncs User data from firestore
 * After LOGIN_SUCCESS we use authenticated users uid to
 * sync userdata
 */
export function* syncUser() {
  yield takeLatest(authActions.LOGIN_SUCCESS, function*() {
    const uid = yield select(state => state.Auth.authUser.uid);
    const roles = yield call(firebaseHelper.rsfFirestore.getDocument, `Roles/${uid}`);
    const channel = firebaseHelper.rsfFirestore.channel(`Users/${uid}`, 'document');
    while (true) {
      const user = yield take(channel);
      if (user) {
        yield put({
          type: actions.SYNC_USER,
          user: user.data(),
          roles: roles.data().roles
        });
      }
    }
  });
}

/**
 * Listens for LOGOUT and removes user and roles
 */
export function* clearUser() {
  yield takeEvery(authActions.LOGOUT, function*() {
    yield put({
      type: actions.CLEAR_USER
    });
  });
}


export default function* rootSaga() {
  yield all([
    fork(syncUser),
    fork(clearUser)
  ]);
}
