import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import userSagas from './user/saga';
export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    userSagas()
  ]);
}
