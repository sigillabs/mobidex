import * as _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import NormalHeader from '../headers/Normal';
import NewOrderDetails from '../../views/NewOrderDetails';

class OrderDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

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
