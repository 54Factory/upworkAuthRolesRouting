import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { ThemeProvider } from 'styled-components';
import WindowResizeListener from 'react-window-size-listener';
import { Debounce } from 'react-throttle';

import appActions from '../../redux/app/actions';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import AppRouter from './DriverRouter';
import DriverHolder from './commonStyle';
import { siteConfig } from '../../settings';
import { themeConfig } from '../../settings';
import themes from '../../settings/themes';
import './global.css';

const { Content, Footer } = Layout;
const { toggleAll } = appActions;

export class Driver extends Component {
  render() {
    const { url } = this.props.match;
    const { height } = this.props;
    const appHeight = window.innerHeight;
    return (
        <ThemeProvider theme={themes[themeConfig.theme]}>
        <DriverHolder>
          <Layout style={{ height: appHeight }}>
            <Debounce time="1000" handler="onResize">
              <WindowResizeListener
                onResize={windowSize =>
                  this.props.toggleAll(
                    windowSize.windowWidth,
                    windowSize.windowHeight
                  )
                }
              />
            </Debounce>
            <Topbar url={url} />
            <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
              <Sidebar url={url} />
              <Layout
                className="isoContentMainLayout"
                style={{
                  height: height
                }}
              >
                <Content
                  className="isomorphicContent"
                  style={{
                    padding: '70px 0 0',
                    flexShrink: '0',
                    background: '#f1f3f6',
                    position: 'relative'
                  }}
                >
                  <AppRouter url={url} />
                </Content>
                <Footer
                  style={{
                    background: '#ffffff',
                    textAlign: 'center',
                    borderTop: '1px solid #ededed'
                  }}
                >
                  {siteConfig.footerText}
                </Footer>
              </Layout>
            </Layout>
          </Layout>
        </DriverHolder>
      </ThemeProvider>
    );
  }
}

export default connect(
  state => ({
    auth: state.Auth,
    user: state.User.user,
    height: state.App.height
  }),
  { toggleAll }
)(Driver);
