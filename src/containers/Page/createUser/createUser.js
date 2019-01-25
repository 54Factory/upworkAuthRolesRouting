import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CreateUser extends Component {
  constructor() {
    super();
  }

  componentWillMount() {

  }

  render() {
    return (
      <div/>
    );
  }

}

export default connect(
  state => ({
    isLoggedIn: state.Auth.authUser !== null ? true : false,
    location: state.router.location
  })
)(CreateUser);
