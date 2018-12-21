import actions from './actions';

const initState = {
  user: null,
  error: null
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        error: null
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        error: action.error,
        user: null
      }
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
