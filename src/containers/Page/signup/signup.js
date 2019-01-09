import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Checkbox from '../../../components/uielements/checkbox';
import Button from '../../../components/uielements/button';
import authAction from '../../../redux/auth/actions';
import IntlMessages from '../../../components/utility/intlMessages';
import SignupStyleWrapper from './signup.style';

import { Input, Form, Icon } from 'antd';
const FormItem = Form.Item;

const { signup, login } = authAction;

class SignUp extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
  };

  static defaultProps = {
    errorMessage: null,
    isLoggedIn: false
  };

  state = {
    redirectToReferrer: false,
    email: '',
    password: '',
    passwordAgain: '',
    errors: {
      email: null, password: null, passwordAgain: null
    },
    validateStatus: {
      email: null, password: null, passwordAgain: null
    }
  };

  constructor() {
    super();
    this.handleSignup = this.handleSignup.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const redirectToReferrer =
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true;
    this.setState({
      redirectToReferrer,
      errors: {
        email: null, password: null, passwordAgain: null
      },
      validateStatus: {
        email: nextProps.errorMessage && 'error',
        password: nextProps.errorMessage && 'error',
        passwordAgain: nextProps.errorMessage && 'error'
      }
    });
  }

  handleSignup(event) {
    event.preventDefault();
    const { signup } = this.props;
    for (const el of ['email', 'password']) {
      if (this.validate(el, this.state[el]) !== null)
        return;
    }
    signup({ email: this.state.email, password: this.state.password });
  };

  validate(fieldName, fieldValue) {
    let errorMsg = null;
    let fieldStatus = 'success';

    if (fieldValue.length === 0) {
      errorMsg = 'Required';
      fieldStatus = 'error';
    }

    if (errorMsg === null) switch(fieldName) {
      case 'email':
        break;
      case 'password':
        if (fieldValue.length < 8) {
          errorMsg = 'Password must be 8 characters long';
          fieldStatus = 'warning';
        }
        break;
      case 'passwordAgain':
        if (fieldValue !== this.state.password) {
          errorMsg = 'Passwords must match';
          fieldStatus = 'error';
        }
        break;
      default: break;
    }

    this.setState({
      errors: {
        ...this.state.errors,
        [fieldName]: errorMsg
      },
      validateStatus: {
        ...this.state.validateStatus,
        [fieldName]: fieldStatus
      }
    });

    return errorMsg;
  }

  onChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    }, () => this.validate(name, value));
  }

  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <SignupStyleWrapper className="isoSignupPage">
        <div className="isoSignupContentWrapper">
          <div className="isoSignupContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <Form className="isoSignupForm" onSubmit={this.handleSignup}>
              <FormItem className="isoInputWrapper"
                hasFeedback
                validateStatus={this.state.validateStatus.email}
                help={this.state.errors.email}
              >
                <Input
                  size="large"
                  value={this.state.email}
                  onChange={this.onChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="email" type="email"
                  placeholder="Email"
                />
              </FormItem>

              <FormItem className="isoInputWrapper"
                hasFeedback
                validateStatus={this.state.validateStatus.password}
                help={this.state.errors.password}
              >
                <Input
                  size="large"
                  value={this.state.password}
                  onChange={this.onChange}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="password" type="password"
                  placeholder="Password"
                />
              </FormItem>

              <FormItem className="isoInputWrapper"
                hasFeedback
                validateStatus={this.state.validateStatus.passwordAgain}
                help={this.state.errors.passwordAgain}
              >
                <Input
                  size="large"
                  value={this.state.passwordAgain}
                  onChange={this.onChange}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="passwordAgain" type="password"
                  placeholder="Repeat Password"
                />
              </FormItem>

              <div className="isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Link to="password_reset" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
              </div>

              <FormItem className="isoSignupButton">
                <Button block type="primary" htmlType="submit">
                  <IntlMessages id="page.signUpButton" />
                </Button>
              </FormItem>

              <div className="isoInputWrapper isoOtherLogin">
                <Button
                  onClick={e => this.props.login('facebook')}
                  type="primary btnFacebook"
                >
                  <IntlMessages id="page.signInFacebook" />
                </Button>
                <Button
                  onClick={e => this.props.login('google')}
                  type="primary btnGooglePlus"
                >
                  <IntlMessages id="page.signInGooglePlus" />
                </Button>
              </div>
              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/signin">
                  <IntlMessages id="page.signUpAlreadyAccount" />
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </SignupStyleWrapper>
    );
  }
}

export { SignUp };

export default connect(
  state => ({
    isLoggedIn: state.Auth.authUser !== null ? true : false,
    errorMessage: state.Auth.error || null,
  }),
  { signup, login }
)(SignUp);
