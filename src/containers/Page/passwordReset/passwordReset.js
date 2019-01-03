import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input, Form, Icon } from 'antd';
import Button from '../../../components/uielements/button';

import IntlMessages from '../../../components/utility/intlMessages';
import authAction from '../../../redux/auth/actions';
import PasswordResetStyleWrapper from './passwordReset.style';

const FormItem = Form.Item;
const { resetPassword } = authAction;

class PasswordReset extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  state = {
    email: '',
    errors: null,
    valid: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      errors: nextProps.error,
      valid: nextProps.error ? 'error' : null
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.resetPassword(this.state.email);
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <PasswordResetStyleWrapper>
        <div className="passwordResetContentWrapper">
          <div className="passwordResetContent">
            <div className="logoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <p className="passwordResetInstructions">
              <IntlMessages id="page.passwordResetInstruction"/>
            </p>

            <Form className="passwordResetForm" onSubmit={this.handleSubmit}>
              <FormItem className="inputWrapper"
                hasFeedback
                validateStatus={this.state.valid}
                help={this.state.errors}
              >
                <Input
                  size="large"
                  value={this.state.email}
                  onChange={this.onChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="email" type="email"
                  placeholder="email"
                />
              </FormItem>

              <FormItem className="submitButton">
                <Button block type="primary" htmlType="submit">
                  <IntlMessages id="page.passwordResetButton"/>
                </Button>
              </FormItem>

              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/signup">
                  <IntlMessages id="page.passwordResetLinkBack" />
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </PasswordResetStyleWrapper>
    );
  }
}

export { PasswordReset };

export default connect(
  state => ({
    isLoggedIn: state.Auth.user !== null ? true : false,
    error: state.Auth.resetError
  }),
  { resetPassword }
)(PasswordReset);
