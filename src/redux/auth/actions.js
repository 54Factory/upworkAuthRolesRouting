const actions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  //
  LOGOUT: 'LOGOUT',
  //
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
  //
  RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERROR: 'RESET_PASSWORD_ERROR',
  //
  resetPassword: (email) => ({
    type: actions.RESET_PASSWORD_REQUEST,
    email
  }),
  signup: (info) => ({
    type: actions.SIGNUP_REQUEST,
    info
  }),
  login: (provider, info) => ({
    type: actions.LOGIN_REQUEST,
    provider,
    info
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};

export default actions;
