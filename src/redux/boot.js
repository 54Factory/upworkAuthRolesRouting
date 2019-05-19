import { store } from './store';
//import authActions from './auth/actions';
import appActions from './app/actions';
//import Firebase from '../helpers/firebase';

export default () =>
  new Promise(() => {
    // if user does not have token in localstorage
    // stop loading and send them to login page
    if (window && !window.localStorage.getItem('loggedIn')) {
      store.dispatch(appActions.setLoading(false, null));
    }
  });
