import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

const routes = [
  {
    path: '',
    component: asyncComponent(() => import('../dashboard')),
  },
  {
    path: 'users',
    component: asyncComponent(() => import('./Users'))
  },
  {
    path: 'customers',
    component: asyncComponent(() => import('./Customers'))
  },
  { path: 'pickups',
    component: asyncComponent(() => import('./Pickups'))
  },
  {
    path: 'locations',
    component: asyncComponent(() => import('./Locations'))
  },
  {
    path: 'drivers',
    component: asyncComponent(() => import('./Drivers'))
  },
  {
    path: 'trucks',
    component: asyncComponent(() => import('./Trucks'))
  },

  {
    path: 'logs',
    component: asyncComponent(() => import('./Logs'))
  },
  {
    path: 'settings',
    component: asyncComponent(() => import('../settings'))
  },
];

class AdminRouter extends Component {
  render() {
    const { url, style } = this.props;
    return (
      <div style={style}>
        {routes.map(singleRoute => {
          const { path, exact, ...otherProps } = singleRoute;
          return (
            <Route
              exact={exact === false ? false : true}
              key={singleRoute.path}
              path={`${url}/${singleRoute.path}`}
              {...otherProps}
            />
          );
        })}
      </div>
    );
  }
}

export default AdminRouter;
