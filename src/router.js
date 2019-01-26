import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import { Spin } from 'antd';
import styled from 'styled-components';

import Admin from './containers/Admin';
import asyncComponent from './helpers/AsyncFunc';

const LoadingOverlayStyle = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 999;
  opacity: 0.5;
  .loading-overlay-spinner {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
  }
`;

const LoadingOverlay = () => (
  <LoadingOverlayStyle>
    <Spin size="large" className="loading-overlay-spinner"/>
  </LoadingOverlayStyle>
);

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

const PublicRoutes = ({ history, isLoggedIn, role, loading }) => {
  return (
    <ConnectedRouter history={history}>
        { loading ? (
          <LoadingOverlay/>
        ) : (
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
        )}
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: state.Auth.authUser !== null,
  role: state.Auth.role,
  loading: state.App.loading,
}))(PublicRoutes);
