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
        error: null
      };
    case actions.SYNC_ROLES:
      return {
        ...state,
        roles: action.roles,
        error: null
      };
    case actions.CLEAR_USER:
      return initState;
    default:
      return state;
  }
}
