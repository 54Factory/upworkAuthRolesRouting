import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from '../../components/uielements/popover';
//import IntlMessages from '../../components/utility/intlMessages';
import userpic from '../../image/user1.png';
import authAction from '../../redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import { Link } from 'react-router-dom';

const { logout } = authAction;

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const profpic = (this.props.profpic && this.props.profpic.url) || userpic;
    let settingsRoute;
    switch(this.props.role) {
      case 'ADMIN':
        settingsRoute = '/admin/settings';
        break;
      case 'DRIVER':
        settingsRoute = '/driver/settings';
        break;
      case 'CUSTOMER':
        settingsRoute = '/customer/settings';
        break;
      default: break;
    }

    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <Link className="isoDropdownLink" to={settingsRoute}>
          Settings
        </Link>
        <div className="isoDropdownLink" onClick={this.props.logout}>
          Logout
        </div>
      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={profpic} />
        </div>
      </Popover>
    );
  }
}
export default connect(
  state => ({
    profpic: state.User.user && state.User.user.profile_picture,
    role: state.Auth.role
  }),
  { logout }
)(TopbarUser);
