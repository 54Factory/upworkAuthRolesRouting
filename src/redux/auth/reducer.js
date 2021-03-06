import actions from './actions';

const initState = {
  authUser: null,
  error: null,
  role: null,
  resetError: null
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    //    case actions.SIGNUP_ERROR:
    //      return {
    //        ...state,
    //        error: action.error,
    //        authUser: null,
    //        role: null
    //      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        authUser: action.authUser,
        role: action.role,
        error: null
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        error: action.error,
        role: null,
        authUser: null
      };
    case actions.LOGOUT:
      return initState;
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
    default:
      return state;
  }
}
