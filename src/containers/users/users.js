import React, { Component } from 'react';
import { Button, Table, Icon, Tag } from 'antd';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import notification from '../../components/notification';

import UsersStyleWrapper from './users.style';
import Firebase from '../../helpers/firebase';
import CreateUserModal from '../../components/createUser';

class Users extends Component {
  state = {
    createUserVisible: false
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      users: [],
      usersCount: null,
      loading: true,
      filteredInfo: null,
      sortedInfo: null
    };
  }

  componentWillMount() {
    let users = [];
    Firebase.database.collection('Users')
      .onSnapshot(querySnapshot => {
        this.setState({ usersCount: querySnapshot.size });
        querySnapshot.forEach((doc) => {
          let i = users.findIndex(u => u.key === doc.id);
          if (i >= 0) {
            users[i] = {
              key: doc.id,
              found: true,
              ...doc.data()
            }
          } else {
            users.push({
              key: doc.id,
              ...doc.data()
            });
          }
        });
        this.setState({ users, loading: false });
      });
  }

  componentWillUnmount() {
    Firebase.database.collection('Users').onSnapshot(() => {});
  }

  handleChange(pagination, filters, sorter) {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render() {
    const { createUserVisible, users, usersCount, loading } = this.state;
    const { view } = this.props;
    const filteredInfo = this.state.filteredInfo || {};
    const sortedInfo = this.state.sortedInfo || {};


    let columns = [];

    columns.push({
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: view === 'MobileView' ? '80%' : '40%',
      sorter: (a, b) => a.email.toLowerCase() > b.email.toLowerCase() ?  -1 : 1,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
    });

    view !== 'MobileView' && columns.push({
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      width: '40%',
      sorter: (a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase() ?-1 : 1,
      sortOrder: sortedInfo.columnKey === 'displayName' && sortedInfo.order,
    });

    columns.push({
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: view === 'MobileView' ? '30%' : '10%',
      filters: [
        { text: 'admin', value: 'ADMIN' },
        { text: 'driver', value: 'DRIVER' },
        { text: 'customer', value: 'CUSTOMER' }
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role.includes(value),
      render: role => (
        <Tag color={
          role === 'ADMIN' ? 'blue' : role === 'DRIVER' ? 'red' : 'green'
        }>{role}</Tag>
      )
    });

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <UsersStyleWrapper>

            <div className="users-top-bar">

              <h2 className="users-top-bar-text">
                Users
              </h2>


              <Button
                className="users-top-bar-button"
                type="primary"
                loading={this.state.createUserVisible}
                onClick={() => this.setState({ createUserVisible: true })}
              >
                Add User
                <Icon type="plus"/>
              </Button>

            </div>

            <Table
              loading={loading}
              columns={columns}
              onChange={this.handleChange}
              dataSource={users}
            />

            <CreateUserModal
              visible={createUserVisible}
              setVisibility={v => this.setState({ createUserVisible: v })}
            />

          </UsersStyleWrapper>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default connect(state => ({
  view: state.App.view
}))(Users);
