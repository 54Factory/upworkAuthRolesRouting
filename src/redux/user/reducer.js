import actions from './actions';

/**
 * Initial User state
 * @param {Object} user - user data
 * @param {Array} roles - list of user roles
 * @param {String} error - error
 */
const initState = {
  user: null,
  roles: null,
  error: null
};

export default function userReducer(state = initState, action) {
  switch (action.type) {
    case actions.SYNC_USER:
      return {
        ...state,
        user: action.user,
        roles: action.roles,
        error: null
      };
    default:
      return state;
  }
}
