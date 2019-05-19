import React, { Component } from 'react';
import { connect } from 'react-redux';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';

//import options from './Sidebar/options';

class DashBoard extends Component {
  render() {
    //const role = this.props.role || '*';

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>DASH BOARD</h1>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default connect(state => ({
  role: state.Auth.role
}))(DashBoard);
