import React, { Component } from 'react';
import { Icon, Form, Button, Radio, Select, Input, Modal } from 'antd';
import notification from '../../../../components/notification';
import Firebase from '../../../../helpers/firebase';

import CreateUserWrapper from './createUserModal.style';

//function hasErrors(fieldsError) {
//  return Object.keys(fieldsError).some(field => fieldsError[field]);
//}

class CreateUser extends Component {
  constructor() {
    super();
    this.sendInvite = this.sendInvite.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      loading: false
    };
  }
      /**
   * Invokes 'createUser' cloud function
   * must be logged in as an admin to call
   * @param {Object} values
   * @param {String} values.email
   * @param {String} values.role - 'DRIVER' or 'CUSTOMER'
   * @param {String} values.display_name
   * @returns {Promse}
   */
  sendInvite() {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const cloudFunc = Firebase.functions.httpsCallable('httpCreateUser');
          cloudFunc(values)
          .then(result => result.data)
          .then(data => {
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        } else reject(err);
      });
    });
  }

  handleOk(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.sendInvite().then(data => {
      this.setState({ loading: false });
      notification('success', 'Invite sent', 'A user was successfully created');
    }).catch(err => {
      this.setState({ loading: false });
      console.log('error');
      notification('error', 'Invite not sent', err.message);
    }).finally(() => {
      this.props.setVisibility(false);
    })
  }

  handleCancel() {
    this.props.setVisibility(false);
  }

  render() {
    const {
      getFieldDecorator,
      // getFieldsError
    } = this.props.form;
    const { loading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="Create User"
        visible={this.props.visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        confirmLoading={loading}
        footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Send Invite
            </Button>,
          ]}
      >
        <CreateUserWrapper>
          <Form className="create-user-form">

            <Form.Item
              {...formItemLayout}
              label="Role"
            >
              {getFieldDecorator('role', {
                rules: [{ required: true, message: 'Please select a role' }],
              })(
                <Radio.Group
                  className="create-user-role-group"
                  name="role"
                  size="large"
                  buttonStyle="solid"
                >
                  <Radio.Button className="create-user-role-button"
                    value="CUSTOMER">CUSTOMER</Radio.Button>
                  <Radio.Button className="create-user-role-button"
                    value="DRIVER">DRIVER</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Email"
            >
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please enter an email' }]
              })(
                <Input
                  size="large"
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="email" type="email"
                  placeholder="user@email.com"
                />
              )}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Name"
            >
              {getFieldDecorator('display_name', {
                rules: [{ required: true, message: 'Please enter a display name' }]
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="user"
                  placeholder="Display Name"
                />
              )}
            </Form.Item>

            {(this.props.form.getFieldValue('role') === 'DRIVER') && (
              <Form.Item
                {...formItemLayout}
                label="License #"
              >
                {getFieldDecorator('licenseNum', {
                  rules: [{ required: true, message: 'Please enter a license number' }]
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="licenseNum" type="num"
                    placeholder="123456789"
                  />
                )}
              </Form.Item>
            )}

            {(this.props.form.getFieldValue('role') === 'DRIVER') && (
              <Form.Item
                {...formItemLayout}
                label="Truck"
              >
                {getFieldDecorator('truck', {
                  rules: [{ required: false }], initialValue: 'unassigned'
                })(
                  <Select
                    size="large"
                    name="truck"
                  >
                    <Select.Option value="unassigned">Unassigned</Select.Option>
                  </Select>
                )}
              </Form.Item>
            )}

            {(this.props.form.getFieldValue('role') === 'CUSTOMER') && (
              <Form.Item
                {...formItemLayout}
                label="Phone"
              >
                {getFieldDecorator('phone_number', {
                  rules: [{ required: true, message: 'Please enter a phone number'}],
                })(
                  <Input
                    size="large"
                    addonBefore="+1"
                    name="phone_number" type="num"
                    placeholder="1423453453"
                  />
                )}
              </Form.Item>
            )}

          </Form>
        </CreateUserWrapper>
      </Modal>
    );
  }
}

export default Form.create({ name: 'create_user' })(CreateUser);
