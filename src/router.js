import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import Admin from './containers/Admin';
import asyncComponent from './helpers/AsyncFunc';

const RestrictedRoute = ({ component: Component, allowed, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      allowed ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const PublicRoutes = ({ history, isLoggedIn, role }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Route
          exact
          path={'/'}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        <Route
          exact
          path={'/signin'}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        <Route
          path={'/password_reset'}
          component={asyncComponent(() => import('./containers/Page/passwordReset'))}
        />

        <RestrictedRoute
          path="/admin"
          component={Admin}
          allowed={isLoggedIn && role === 'ADMIN'}
        />
      </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: state.Auth.authUser !== null,
  role: state.Auth.role
}))(PublicRoutes);
