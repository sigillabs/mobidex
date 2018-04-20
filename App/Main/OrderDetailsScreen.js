import * as _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import NewOrderDetails from '../views/NewOrderDetails';

class OrderDetailsScreen extends Component {
  render() {
    const {
      navigation: {
        state: {
          params: { order }
        }
      }
    } = this.props;
    return (
      <ScrollView>
        <NewOrderDetails order={order} />
      </ScrollView>
    );
  }
}

export default connect(
  state => ({ ...state.wallet }),
  dispatch => ({ dispatch })
)(OrderDetailsScreen);
