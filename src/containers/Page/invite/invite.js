import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { message, Spin, Progress, Button, Icon, Input, Steps, Form, Upload } from 'antd';

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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png'
  if (!isJPG && !isPNG) {
    message.error('You can only a jpeg or png');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return (isPNG || isJPG) && isLt2M;
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
      imageUrl: null,
      imageLoading: false,
      imageProgress: 0,
      imageId: null,
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
                  value: this.props.user.display_name || '',
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
    const { form, imageId, imageUrl } = this.state;
    const { uid } = this.props.authUser;
    this.setState({ submitting: true });
    Firebase.rsfAuth().currentUser
      .updatePassword(form.password.value)
      .then(() => {
        Firebase.database.collection('Users').doc(uid).update({
          display_name: form.display_name.value,
          phone_number: form.phone_number.value,
          email_verified: true,
          profile_picture: {
            id: imageId || null,
            url: imageUrl || null
          }
        }).then(() => {
          this.setState({
            submitting: false
          });
          console.log(this.props.role);
          switch(this.props.role) {
            case 'ADMIN': {
              this.props.history.push('/admin');
              break;
            }
            case 'CUSTOMER': {
              this.props.history.push('/customer');
              break;
            }
            case 'DRIVER': {
              this.props.history.push('/driver');
              break;
            }
            default: break;
          }

        })
      });
  }

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
    const {
      step, form, submitting,
      imageUrl, imageLoading, imageProgress
    } = this.state;
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
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={this.uploadImage}
            beforeUpload={beforeUpload}
            onChange={this.imageChange}
          >
            <div className="avatar-container">
              { imageUrl && <img className="avatar-img" src={imageUrl} alt="avatar"/> }
              { !imageUrl && !imageLoading && (
                <div>
                  <Icon type="plus"/>
                  <Icon className="avatar-upload-avatar" type="user" />
                  <div className="avatar-upload-button-text">Upload</div>
                </div>
              )}
              { imageLoading && (
                <Progress
                  type="circle"
                  percent={Math.floor(imageProgress)}
                  className="avatar-upload-progress"
                />
              )}
            </div>
          </Upload>
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
      this.setState({ step: step + 1 }, () => {
        // auto focus next field
        const focusTimer = setInterval(() => {
          if (this[this.steps[this.state.step].inputs[0].name]) {
            this[this.steps[this.state.step].inputs[0].name].focus();
            clearInterval(focusTimer);
          }
        }, 50);
      });
    else this.submit();
  }

  stepBack = e => {
    e.preventDefault();
    const { step } = this.state;
    if (step > 0)
      this.setState({ step: step - 1 }, () => {
        // auto focus next field
        const focusTimer = setInterval(() => {
          if (this[this.steps[this.state.step].inputs[0].name]) {
            this[this.steps[this.state.step].inputs[0].name].focus();
            clearInterval(focusTimer);
          }
        }, 50);
      });
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

  imageChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ imageLoading: true });
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl
      }));
    }
  }

  uploadImage = ({ file, onProgress, onError, onSuccess }) => {
    this.setState({ imageLoading: true });
    const metadata = {
      contentType: file.type,
      name: file.name,
      size: file.size
    };

    Firebase.uploadImage(file, metadata, err => {
      this.setState({ imageLoading: false });
      onError(err);
    }, prog => {
      this.setState({ imageProgress: prog });
      onProgress(prog);
    }, ({ url, uuid }) => {
      onSuccess(url);
      this.setState({ imageLoading: false, imageId: uuid });
    });
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
