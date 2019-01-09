import actions from './actions';

describe('Auth actions', () => {
  it('Login creates LOGIN_REQUEST action', () => {
    const expectedAction = {
      type: actions.LOGIN_REQUEST,
      provider: 'email',
      info: {
        email: 'test@test.com',
        password: 'password'
      }
    };
    expect(
      actions.login(expectedAction.provider, expectedAction.info)
    ).toEqual(expectedAction);
  });

  it('Logout creates LOGOUT action', () => {
    const expectedAction = {
      type: actions.LOGOUT
    };
    expect(
      actions.logout()
    ).toEqual(expectedAction);
  });
});
