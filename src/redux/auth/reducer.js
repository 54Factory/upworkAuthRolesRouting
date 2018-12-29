import actions from './actions';

const initState = {
  user: null,
  error: null,
  resetError: null
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.RESET_PASSWORD_ERROR:
      return {
        ...state,
        resetError: action.error
      };
    case action.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetError: null
      };
    case actions.SIGNUP_ERROR:
      return {
        ...state,
        error: action.error,
        user: null
      };
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
