import { call, put, takeEvery, take } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import {
  watchSignupRequest, signupRequest,
  watchSignupError, signupError
} from './saga';
import actions from './actions';
import notification from '../../components/notification';

describe('Auth sagas', () => {
  describe('signupRequest', () => {
    it('Should takeEvery SIGNUP_REQUEST', () => {
      const gen = cloneableGenerator(watchSignupRequest)();
      expect(
        gen.next().value
      ).toEqual(takeEvery(actions.SIGNUP_REQUEST, signupRequest));
    });

    it('Should put SIGNUP_ERROR on bad data', () => {
      const gen = cloneableGenerator(signupRequest)();
      expect(
        gen.next({
          type: actions.SIGNUP_REQUEST,
          info: {
            email: 'bad email',
            password: 'bad password'
        }}).value
      ).toEqual(put({
        type: actions.SIGNUP_ERROR,
        error: 'Authentication Error'
      }));
    });
  });

  describe('signupError', () => {
    it('Should takeEvery SIGNUP_ERROR', () => {
      const gen = cloneableGenerator(watchSignupError)();
      expect(
        gen.next().value
      ).toEqual(takeEvery(actions.SIGNUP_ERROR, signupError));
    });

    it('Should call notification on SIGNUP_ERROR', () => {
      const gen = cloneableGenerator(signupError)();
      expect(
        gen.next().value
      ).toEqual(call(notification, 'error', 'Error', 'Error'));
    });
  })
});
