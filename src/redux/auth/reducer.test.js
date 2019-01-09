import actions from './actions';
import reducer from './reducer';

const initState = {
  authUser: null,
  error: null,
  resetError: null
};

describe('Auth reducer', () => {
  it('Should return intial state', () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it('Should return intial state on LOGOUT', () => {
    expect(reducer(undefined, {
      type: actions.LOGOUT
    })).toEqual(initState);
  });

  it('Should return authUser on LOGIN_SUCCESS', () => {
    expect(reducer(undefined, {
      type: actions.LOGIN_SUCCESS,
      authUser: {
        uid: 'test'
      }
    })).toEqual({
      ...initState,
      authUser: {
        uid: 'test'
      }
    });
  });

  it('Should return error on LOGIN_ERROR', () => {
    expect(reducer(undefined, {
      type: actions.LOGIN_ERROR,
      error: 'Login error'
    })).toEqual({
      ...initState,
      error: 'Login error'
    });
  });

  it('Should return error on SIGNUP_ERROR', () => {
    expect(reducer(undefined, {
      type: actions.SIGNUP_ERROR,
      error: 'Signup error'
    })).toEqual({
      ...initState,
      error: 'Signup error'
    });
  });

  it('Should return error on RESET_PASSWORD_ERROR', () => {
    expect(reducer(undefined, {
      type: actions.RESET_PASSWORD_ERROR,
      error: 'Reset error'
    })).toEqual({
      ...initState,
      resetError: 'Reset error'
    });
  });

  it('Should return initial state on RESET_PASSWORD_SUCCESS', () => {
    expect(reducer(undefined, {
      type: actions.RESET_PASSWORD_SUCCESS
    })).toEqual(initState);
  });
});

