import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';

import notification from '../components/notification';
import Firebase from '../helpers/firebase';

function generatePassword() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default class extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  /**
   * Invokes 'createUser' cloud function
   * must be logged in as an admin to call
   * @param {Object} userInfo
   * @param {String} userInfo.email
   * @param {String} userInfo.role - 'DRIVER' or 'CUSTOMER'
   * @param {String} userInfo.displayName
   * @returns {Promse}
   */
  createUser = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const cloudFunc = Firebase.functions.httpsCallable('httpCreateUser');
    cloudFunc({
      email: 'kmurf1999@gmail.com',
      displayName: 'demo',
      role: 'DRIVER'
    })
    .then(result => result.data)
    .then(data => {
      console.log(data);
      this.setState({ loading: false });
    }).catch(err => {
      console.log(err);
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>CREATE USER</h1>
          { loading
              ? (<div>loading</div>)
              : (<button onClick={this.createUser}>create user</button>)
          }
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
