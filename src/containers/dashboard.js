import React, { Component } from 'react';
import { connect } from 'react-redux';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';

import options from './Sidebar/options';

class DashBoard extends Component {
  render() {
    const role = this.props.role || '*';

    // contains paper-like links to admin tabs
    // only show options for the logged in role
    const cards = options
      .filter(o => o.role === role || o.role === '*')
      .map(o => {
        return (
          <div className="dashboard-paper">

          </div>
        );
    });

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>

          <h1>DASH BOARD</h1>
          <div className="dashboard-paper-container">
            {cards}
          </div>

        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default connect(state => ({
  role: state.Auth.role
}))(DashBoard);
