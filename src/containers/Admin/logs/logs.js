import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Tag } from 'antd';

import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import LogsStyleWrapper from './logs.style';
import Firebase from '../../../helpers/firebase';

/** simple hash function for a string -> int **/
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

/** conver integer to rgb **/
function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

class Logs extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      loading: true,
      logs: [],
      filteredInfo: null,
      sortedInfo: null
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    let logs = [];
    Firebase.database.collection('Logs')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          let i = logs.findIndex(l => l.key === doc.id);
          if (i >= 0) {
            logs[i] = {
              key: doc.id,
              found: true,
              ...doc.data()
            };
          } else {
            logs.push({
              key: doc.id,
              ...doc.data()
            });
          }
        });
        this.setState({ logs, loading: false });
      });
  }

  componentWillUnmount() {
    Firebase.database.collection('Logs').onSnapshot(() => {});
  }

  handleChange(pagination, filters, sorter) {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render() {
    const { view } = this.props;
    const {
      logs, loading
    } = this.state;
    const filteredInfo = this.state.filteredInfo || {};
    const sortedInfo = this.state.sortedInfo || {};

    const col1 = {
      title: 'Function',
      dataIndex: 'function',
      key: 'function',
      width: view === 'MobileView' ? '40%' : '20%',
      filters: [
        { text: 'createUser', value: 'createUser' },
      ],
      filteredValue: filteredInfo.function || null,
      onFilter: (value, record) => record.function.includes(value),
      render: fn => (
        <Tag color={"#"+intToRGB(hashCode(fn))}>{fn}</Tag>
      )
    };
    const col2 = {
      title: 'Time',
      dataIndex: 'created_on',
      key: 'created_on',
      width: '20%',
      sorter: (a, b) => a.created_on > b.created_on ? -1 : 1,
      sortOrder: sortedInfo.columnKey === 'created_on' && sortedInfo.order,
      render: time => {
        const d = new Date(time);
        const t = `${d.getHours()}:${d.getMinutes()}`;
        const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
        return <div>{date + " " + t}</div>;
      }
    };
    const col3 = {
      title: 'Message',
      dataIndex: 'error_message',
      key: 'error_message',
      width: '60%'
    };

    let columns;
    if (view === 'MobileView') {
      columns = [col1, col3];
    } else {
      columns = [col1, col2, col3];
    }

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <LogsStyleWrapper>
            <div className="logs-top-bar">
              <h2 className="logs-top-bar-text">Logs</h2>
            </div>

            <Table
              loading={loading}
              columns={columns}
              dataSource={logs}
              onChange={this.handleChange}
            />
          </LogsStyleWrapper>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default connect(state => ({
  view: state.App.view
}))(Logs);
