import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin, Button, Icon, Input, Steps, Form } from 'antd';
import { push } from 'react-router-redux';

import Firebase from '../../../helpers/firebase';

import InvitePageStyleWrapper from './invite.style';

const passwordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

/**
 * Parses url query string into object
 * @param {String} query
 * @returns {Object}
 */
function parseQueryString(query) {
  const vars = {};
  query.substring(1).split('&').forEach(v => {
    v = v.split('=');
    vars[v[0]] = v[1];
  });
  return vars;
}


/**
 * A page for a user to accept an invite
 * @class InvitePage
 * @param {String} inviteId - used to fetch user information
 * @example
 *
 *  https://site_url.com/invite?id=THIS_IS_THE_INVITE_ID
*/
class InvitePage extends Component {
  steps = [
    {
      header: 'Set a Password',
      inputs: [{
        name: 'password', placeholder: 'Password',
        icon: 'lock', type: 'password'
      }]
    },
    { header: 'Confirm Password',
      inputs: [{
        name: 'password_again', placeholder: 'Re-enter Password',
        icon: 'check', type: 'password'
      }]
    }, {
      header: 'Additional Information',
      inputs: [{
        name: 'display_name', placeholder: 'Display Name',
        icon: 'user', type: 'text'
      }, {
        name: 'phone_number', placeholder: '1112223333',
        icon: 'phone', type: 'num'
      }]
    }
  ];

  constructor() {
    super();
    this.renderError = this.renderError.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.state = {
      step: 0,
      form: {
        password: {
          value: '',
          touched: false,
          error: null
        },
        password_again: {
          value: '',
          touched: false,
          error: null
        },
        display_name: {
          value: '',
          touched: false,
          error: null
        }
      },
      submitting: false,
      loading: true,
      id: null,
      error: null,
      success: false
    };
  }

  componentWillMount(props) {
    const urlParams = parseQueryString(this.props.location.search);

    if ('id' in urlParams) {
      this.setState({ id: urlParams.id });


      const cloudFunc = Firebase.functions.httpsCallable('httpRetreiveInvite');
      cloudFunc({ inviteId: urlParams.id })
        .then(res => {
          const data = res.data
          const credential = Firebase.rsfAuth.EmailAuthProvider.credential('a', 'c');
          credential.a = data.a;
          credential.c = data.c;
          return Firebase.rsfAuth().signInAndRetrieveDataWithCredential(credential).then(() => {
            this.setState({
              loading: false, success: true,
              // pre-fill fields
              form: {
                ...this.state.form,
                display_name: {
                  ...this.state.form.display_name,
                  value: this.props.user.displayName || '',
                  touched: true
                },
                phone_number: {
                  ...this.state.form.phone_number,
                  value: this.props.user.phone_number || '',
                  touched: true
                }
              }
            });
          });
        })
        .catch(err => {
          this.setState({
            loading: false,
            error: err.message
          });
        });

    } else {
      // invalid query
      return this.setState({
        loading: false,
        error: 'Invalid invite'
      });
    }
  }

  submit() {
    const { form } = this.state;
    const { uid } = this.props.authUser;
    const { role } = this.props;
    this.setState({ submitting: true });
    Firebase.rsfAuth().currentUser
      .updatePassword(form.password.value)
      .then(() => {
        Firebase.database.collection('Users').doc(uid).set({
          displayName: form.display_name.value,
          phoneNum: form.phone_number.value,
          email_verified: true
        }).then(() => {
          this.setState({
            submitting: false
          });
          switch(role) {
            case 'ADMIN': {
              push('/admin');
              break;
            }
            case 'CUSTOMER': {
              push('/customer');
              break;
            }
            case 'DRIVER': {
              push('/driver');
              break;
            }
            default: break;
          }

        })
      });
  }

  //  componentDidUpdate() {
  //    const { loading, step } = this.state;
  //    if (!loading)
  //      this[this.steps[step].inputs[0].name].focus();
  //  }

  renderLoading() {
    return (
      <div className="invite-page-loading-wrapper">
        <div className="invite-page-loading-text">Fetching Data</div>
        <Spin className="invite-page-loading-spinner"/>
      </div>
    );
  }

  renderError() {
    return (
      <div className="invite-page-error-wrapper">
        <Icon
          className="invite-page-error-icon"
          type="frown"
        />
        <h2 className="invite-page-error-header">
          Sorry.
        </h2>
        <p>
          The invite link you used is invalid or has expired.
        </p>

        <Link to="/">
          <Button
            className="invite-page-error-return"
          >Back to Home</Button>
        </Link>
      </div>
    );
  }

  renderSuccess() {
    const Step = Steps.Step;
    const { step, form, submitting } = this.state;
    const { view, user } = this.props;

    let currentFields = this.steps[step].inputs.map(it => (
      <Form.Item
        help={form[it.name].error || null}
        key={`form-item-${it.name}`}
        validateStatus={
          form[it.name].touched ?
          (form[it.name].error ? 'error': 'success') :
          null
        }
        hasFeedback
      >
        <Input
          prefix={<Icon type={it.icon} style={{ color: 'rgba(0,0,0,.25)' }} />}
          ref={input => { this[it.name] = input; }}
          type={it.type} placeholder={it.placeholder}
          size="large" name={it.name}
          value={form[it.name].value}
          onChange={this.onChange}
          onBlur={() => this.onTouch(it.name)}
        />
      </Form.Item>
    ));

    let valid = true;
    this.steps[step].inputs.forEach(it => {
      valid = valid && (!form[it.name].error && form[it.name].touched);
    });

    return (
      <div className="invite-page-success-wrapper">
        <div className="invite-page-success-email">
          <h3>{user && `Welcome, ${user.email}`}</h3>
          <div>Complete this form to finish creating your account</div>
        </div>
        <Steps size="small" current={step}>
          <Step
            title={view === "MobileView" ? 'Set Password' : ''}
            icon={<Icon type="lock"/>}
          />
          <Step
            title={view === "MobileView" ? 'Confirm Password' : '' }
            icon={<Icon type="check-circle"/>}
          />
          <Step
            title={view === "MobileView" ? 'Additional Information' : '' }
            icon={<Icon type="profile"/>}
          />
        </Steps>

        <form
          onSubmit={this.stepForward}
          className="invite-page-success-form"
        >
          <h2 className="invite-page-success-form-header">
            {this.steps[step].header}
          </h2>
          {currentFields}
        </form>

        <div className="invite-page-success-buttons">
          <Button
            className="invite-page-success-button"
            disabled={step === 0}
            onClick={this.stepBack}
          >
            <Icon type="left"/>
            Prev
          </Button>
          <Button
            type="primary"
            className="invite-page-success-button"
            onClick={this.stepForward}
            disabled={!valid}
            loading={submitting}
          >
            { step === this.steps.length - 1 ? 'Submit' : 'Next' }
            <Icon type="right"/>
          </Button>

        </div>
      </div>
    );
  }

  stepForward = e => {
    e.preventDefault();
    const { step } = this.state;
    if (step < this.steps.length - 1)
      this.setState({ step: step + 1 });
    else this.submit();
  }

  stepBack = e => {
    e.preventDefault();
    const { step } = this.state;
    if (step > 0)
      this.setState({ step: step - 1 });
  }

  onChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    const { form } = this.state;
    form[name].value = value;
    form[name].touched = true;
    this.setState({ form }, () => this.validateField(name));
  }

  onTouch = name => {
    const { form } = this.state;
    form[name].touched = true;
    this.setState({ form });
  }

  validateField = name => {
    const { form } = this.state;
    switch(name) {
      case 'password': {
        if (form[name].value === '') {
          form[name].error = 'Password is required';
        } else if (!passwordRegex.test(form[name].value)) {
          form[name].error = 'Password is not strong enough';
        } else {
          form[name].error = null
        }
        break;
      }
      case 'password_again': {
        if (form[name].value !== form.password.value) {
          form[name].error = 'Passwords must match';
        } else {
          form[name].error = null;
        }
        break;
      }
      default: break;
    }
    this.setState({ form });
  }

  render() {
    const { loading, error, success } = this.state;
    return (
      <InvitePageStyleWrapper className="invite-page">
        <div className="invite-page-content-wrapper">
          <div className="invite-page-content">
            <div className="invite-page-title-wrapper">
              <h1> Create Account </h1>
            </div>

            { loading && this.renderLoading() }
            { !loading && error && this.renderError() }
            { !loading && success && this.renderSuccess() }

          </div>
        </div>
      </InvitePageStyleWrapper>
    );
  }
}


export default connect(
  state => ({
    isLoggedIn: state.Auth.authUser && true,
    authUser: state.Auth.authUser,
    role: state.Auth.role,
    user: state.User.user,
    view: state.App.view
  })
)(InvitePage);
