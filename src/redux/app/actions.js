export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

const actions = {
  COLLAPSE_CHANGE: 'COLLAPSE_CHANGE',
  COLLAPSE_OPEN_DRAWER: 'COLLAPSE_OPEN_DRAWER',
  CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
  TOGGLE_ALL: 'TOGGLE_ALL',
  CHANGE_CURRENT: 'CHANGE_CURRENT',
  CLOSE_ALL: 'CLOSE_ALL',
  SET_LOADING: 'SET_LOADING',

  toggleCollapsed: () => ({
    type: actions.COLLAPSE_CHANGE
  }),

  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height
    };
  },

  toggleOpenDrawer: () => ({
    type: actions.COLLAPSE_OPEN_DRAWER
  }),

  changeOpenKeys: openKeys => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys
  }),

  changeCurrent: current => ({
    type: actions.CHANGE_CURRENT,
    current
  }),

  closeAll: () => ({ type: actions.CLOSE_ALL }),

  setLoading: loading => ({
    type: actions.SET_LOADING,
    loading
  })
};

export default actions;
