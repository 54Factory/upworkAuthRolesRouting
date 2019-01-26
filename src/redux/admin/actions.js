const actions = {
  CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
  createUser: userInfo => ({
    type: actions.CREATE_USER_REQUEST,
    userInfo
  })
};

export default actions;