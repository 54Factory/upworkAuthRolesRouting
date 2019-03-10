import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { Icon, Button } from 'antd';

import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';

import LocationsList from './locationsList';
import LocationsStyleWrapper from './locations.style';

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      addLocationVisible: false,
    };
  }

  render() {
    const { addLocationVisible } = this.state;

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <LocationsStyleWrapper>
            <div className="locations-header">
              <h2>Locations</h2>
              <Button
                className="locations-add-button"
                type="primary"
                loading={addLocationVisible}
              >
                Add Location
                <Icon type="plus"/>
              </Button>
            </div>

            <div className="locations-map">
              <GoogleMapReact>
                {/** TODO need paid google maps api key **/}
              </GoogleMapReact>
            </div>

            <LocationsList/>
          </LocationsStyleWrapper>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default Locations;
