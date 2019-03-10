import React, { Component } from 'react';
import { connect } from 'react-redux';

import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import SettingsStyleWrapper from './settings.style';

class Settings extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <SettingsStyleWrapper>
            <div className="settings-top-bar">
              <h2>Settings</h2>
            </div>

          </SettingsStyleWrapper>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default Settings;
