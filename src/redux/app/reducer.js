import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = {
  collapsed: window.innerWidth > 1220 ? false : true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  openKeys: preKeys,
  current: preKeys,
  loading: true,
  // if route is not null we'll push to it on page load
};
export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.COLLAPSE_CHANGE:
      return { ...state, collapsed: !state.collapsed };
    case actions.COLLAPSE_OPEN_DRAWER:
      return { ...state, openDrawer: !state.openDrawer };
    case actions.TOGGLE_ALL:
      if (state.view !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return {
          ...state,
          collapsed: action.collapsed,
          view: action.view,
          height: height
        };
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return { ...state, openKeys: action.openKeys };
    case actions.CHANGE_CURRENT:
      return { ...state, current: action.current };
    case actions.CLOSE_ALL:
      return { ...state, current: [], openKeys: [] };
    case actions.SET_LOADING:
      return { ...state, loading: action.loading };
    default:
      return state;
  }
  return state;
}
