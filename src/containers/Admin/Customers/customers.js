import React, { Component } from 'react';

import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import CustomersStyle from './customers.style';

class Customers extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <CustomersStyle>
            
          </CustomersStyle>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default Customers;
