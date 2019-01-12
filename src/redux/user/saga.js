import { select, all, takeEvery, take, put, fork, call } from 'redux-saga/effects';
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
  yield takeEvery(authActions.LOGIN_SUCCESS, function*() {
    const authState = yield select(state => state.Auth);
    const channel = firebaseHelper.channel(`Users/${authState.authUser.uid}`, 'document');
    while (true) {
      const { val, err } = yield take(channel);
      if (val && val.data()) {
        // update redux state with user data
        yield put({
          type: actions.SYNC_USER,
          user: val.data()
        });
      }
    }
  });
}

//export function* syncRoles() {
//  yield takeLatest(authActions.LOGIN_SUCCESS, function*() {
//    const uid = yield select(state => state.Auth.authUser.uid);
//    const channel = firebaseHelper.channel(`Roles/${uid}`, 'document');
//    while (true) {
//      const { val, err } = yield take(channel);
//      if (val && val.data()) {
//        yield put({
//          type: actions.SYNC_ROLES,
//          hasDeclaredRole: val.data().role,
//          role: val.data().role
//        });
//      }
//    }
//  });
//}

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
    //    fork(syncRoles),
    fork(clearUser)
  ]);
}
