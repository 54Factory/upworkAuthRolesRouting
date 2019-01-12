const actions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',

  LOGOUT: 'LOGOUT',

  SET_ROLE: 'SET_ROLE',
  //  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  //  SIGNUP_ERROR: 'SIGNUP_ERROR',

  RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERROR: 'RESET_PASSWORD_ERROR',

  /**
   * Sends password reset email
   */
  resetPassword: (email) => ({
    type: actions.RESET_PASSWORD_REQUEST,
    email
  }),

  /**
   * Creates new user
   * @param {String} info.email
   * @param {String} info.password
   */
  //  signup: (info) => ({
  //    type: actions.SIGNUP_REQUEST,
  //    info
  //  }),

  /**
   * Login for user
   * @param {String} provider - 'email', 'google', 'facebook'
   * @param {String} info - optional {email, password}
   */
  login: (provider, info) => ({
    type: actions.LOGIN_REQUEST,
    provider,
    info
  }),

  /**
   * Logs out firebase user
   */
  logout: () => ({
    type: actions.LOGOUT
  })
};

export default actions;
