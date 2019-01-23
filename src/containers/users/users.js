import React, { Component } from 'react';
import { Button, Table, Icon, Tag } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import notification from '../../components/notification';

import Firebase from '../../helpers/firebase';

import CreateUserModal from '../../components/createUser';

export default class Users extends Component {
  state = {
    createUserVisible: false
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      users: [],
      loading: true,
      filteredInfo: null,
      sortedInfo: null
    };
  }

  componentWillMount() {
    let users = [];
    Firebase.database.collection('Users')
      .onSnapshot(querySnapshot => {
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
    const { createUserVisible, users, loading } = this.state;
    const filteredInfo = this.state.filteredInfo || {};
    const sortedInfo = this.state.sortedInfo || {};

    const columns = [{
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      sorter: (a, b) => a.email.toLowerCase() > b.email.toLowerCase() ?  -1 : 1,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
    },{
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      width: '50%',
      sorter: (a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase() ?-1 : 1,
      sortOrder: sortedInfo.columnKey === 'displayName' && sortedInfo.order,
    },{
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '20%',
      filters: [
        { text: 'admin', value: 'ADMIN' },
        { text: 'driver', value: 'DRIVER' },
        { text: 'customer', value: 'CUSTOMER' }
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role.includes(value),
      render: role => <Tag color={role === 'ADMIN' ? 'blue' : role === 'DRIVER' ? 'red' : 'green'}>{role}</Tag>
    }];

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>

          <Button
            type="primary"
            loading={this.state.createUserVisible}
            onClick={() => this.setState({ createUserVisible: true })}
          >
            Add User
            <Icon type="plus"/>
          </Button>

          <Table loading={loading} columns={columns} onChange={this.handleChange} dataSource={users}/>

          <CreateUserModal
            visible={createUserVisible}
            setVisibility={v => this.setState({ createUserVisible: v })}
          />

        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
