import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Table, Tag } from 'antd';

import LayoutWrapper from '../../../components/utility/layoutWrapper';
import Paper from '../../../components/utility/paper';
import LogsStyleWrapper from './logs.style';
import Firebase from '../../../helpers/firebase';

const { RangePicker } = DatePicker;

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

const columns = [{
  title: 'Function',
  dataIndex: 'function',
  render: fn => <Tag color={"#"+intToRGB(hashCode(fn))}>{fn}</Tag>,
  width: '20%',
  filters: [{
    text: 'createUser', value: 'createUser'
  }]
},{
  title: 'Time',
  dataIndex: 'created_on',
  render: time => new Date(time).toLocaleString(),
  width: '20%',
  sorter: true
},{
  title: 'Message',
  dataIndex: 'error_message',
  width: '60%'
}];

class Logs extends Component {
  constructor() {
    super();
    this.state = {
      range: null,
      loading: true,
      logs: [],
      pagination: {},
      filters: {},
      sorter: {}
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    const { sorter, range, filters } = this.state;

    // init collection
    let Collection = Firebase.database.collection('Logs');

    // apply datetime range filters
    if (range) {
      Collection = Collection
        .where("created_on", ">=", range[0].getTime())
        .where("created_on", "<=", range[1].getTime());
    }

    // apply function filters
    if (filters.function && filters.function.length > 0) {
      // create seperate 'where' clauses
      // and merge at the end
      let temp = {};
      filters.function.forEach(fn => {
        temp = Object.assign(
          Collection.where('function', '==', fn), temp
        );
      });
      Collection = temp;
    }

    // apply sorting
    // created two logs indices in firestore
    // 1. function: ascending, created_on: descending
    // 2. function: ascending, created_on: descending
    if (sorter.field) {
      Collection = sorter.order === 'descend'
        ? Collection.orderBy(sorter.field, 'desc')
        : Collection.orderBy(sorter.field);
    } else {
      Collection = Collection.orderBy('created_on', 'desc');
    }

    // apply pagination
    //    if (pagination) {
    //      Collection = Collection
    //        .limit(10)
    //        .startAt((pagination.current - 1) * pagination.pageSize + 1);
    //    } else {
    //      Collection = Collection.limit(10).startAt(0);
    //    }

    // execute query and get data
    let logs = [];
    Collection
      .get()
      .then(snap => {
        snap.forEach(doc => {
          logs.push({
            ...doc.data(),
            key: doc.id
          });
        });
      })
      .catch(err => {
          console.log("Error getting documents: ", err);
      })
      .finally(() =>
        this.setState({ logs, loading: false }));

  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filters,
      sorter
    }, () => this.getData());
  }

  onDateChange = (dates, dateString) => {
    this.setState({
      range: dates.length > 1 ? [dates[0]._d, dates[1]._d] : null
    }, () => this.getData());
  }

  render() {

    return (
      <LayoutWrapper style={{ height: '100vh' }}>
        <LogsStyleWrapper>
          <Paper title="Logs"
            right={
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Start Time', 'End Time']}
                onChange={this.onDateChange}
              />
            }
          >
            <Table
              columns={columns}
              loading={this.state.loading}
              dataSource={this.state.logs}
              onChange={this.handleChange}
            />
          </Paper>
        </LogsStyleWrapper>
      </LayoutWrapper>
    );
  }
}

export default connect(state => ({
  view: state.App.view
}))(Logs);
