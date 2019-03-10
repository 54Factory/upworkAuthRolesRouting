import { select, all, takeEvery, take, put, fork } from 'redux-saga/effects';
//import { push } from 'react-router-redux';
import Firebase from '../../helpers/firebase';
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
    // create channel to listen for user changes
    const channel = Firebase.channel(`Users/${authState.authUser.uid}`, 'document');
    while (true) {
      const { val, err } = yield take(channel);
      if (val && val.data()) {
        // update redux state with user data
        yield put({
          type: actions.SYNC_USER,
          user: val.data()
        });
      } else if (err) {
        console.log(err);
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
