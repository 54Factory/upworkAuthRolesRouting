import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
//import Input from '../../components/uielements/input';
//import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';

import { Input, Form, Icon } from 'antd';
const FormItem = Form.Item;

const { login } = authAction;

class SignIn extends Component {
  state = {
    redirectToReferrer: false,
    email: '',
    password: '',
    errors: {
      email: null, password: null
    },
    validateStatus: {
      email: null, password: null
    }
  };

  componentWillReceiveProps(nextProps) {
    const redirectToReferrer =
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true;
    this.setState({
      redirectToReferrer,
      errors: {
        email: null, password: null
      },
      validateStatus: {
        email: nextProps.errorMessage && 'error',
        password: nextProps.errorMessage && 'error',
      }
    });
  }

  handleLogin = (event, provider) => {
    event.preventDefault();
    const { login } = this.props;
    if (provider === 'email') {
      for (const el of ['email', 'password']) {
        if (this.validate(el, this.state[el]) !== null)
          return;
      }
      login(provider, { email: this.state.email, password: this.state.password });
    } else
      login(provider, {});
    //this.props.history.push('/dashboard');
  };

  validate = (fieldName, fieldValue) => {
    let errorMsg = null;
    let fieldStatus = 'success';

    if (fieldValue.length === 0) {
      errorMsg = 'Required';
      fieldStatus = 'error';
    }

    if (errorMsg === null) switch(fieldName) {
      case 'email':
      case 'password':
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

  onChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    }, this.validate(e.target.name, e.target.value));
  }

  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <Form className="isoSignInForm" onSubmit={e => this.handleLogin(e, 'email')}>
              <FormItem className="isoInputWrapper"
                hasFeedback
                validateStatus={this.state.validateStatus.email}
                help={this.state.errors.email}
              >
                <Input size="large"
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
                <Input size="large"
                  value={this.state.password}
                  onChange={this.onChange}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="password" type="password"
                  placeholder="Password"
                />
              </FormItem>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Button type="primary" htmlType="submit">
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

              <div className="isoInputWrapper isoOtherLogin">
                <Button onClick={e => this.handleLogin(e, 'facebook')} type="primary btnFacebook">
                  <IntlMessages id="page.signInFacebook" />
                </Button>
                <Button onClick={e => this.handleLogin(e, 'google')} type="primary btnGooglePlus">
                  <IntlMessages id="page.signInGooglePlus" />
                </Button>
              </div>
              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
                <Link to="">
                  <IntlMessages id="page.signInCreateAccount" />
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

//<FormItem className="isoInputWrapper" hasFeedback>
//  {getFieldDecorator('password', {
//    rules: [{ required: true, message: 'Please input your password!' }],
//  })(
//  )}
//</FormItem>


export default connect(
  state => ({
    isLoggedIn: state.Auth.user !== null ? true : false,
    errorMessage: state.Auth.error || null,
  }),
  { login }
)(SignIn);
