import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import TinyHeader from '../../components/TinyHeader';
import OrderItem from './Item';

class OrderList extends Component {
  render() {
    return (
      <View>
        <TinyHeader>{this.props.title}</TinyHeader>
        <List
          containerStyle={{
            flex: 1,
            width: this.props.width,
            marginTop: 3,
            marginBottom: 10
          }}
        >
          {this.props.orders.map((order, index) => (
            <TouchableOpacity
              key={`bid-${index}`}
              onPress={() => this.props.onPress(order)}
            >
              <ListItem
                bottomDivider
                title={<OrderItem order={order} />}
                leftIcon={{ name: this.props.icon }}
              />
            </TouchableOpacity>
          ))}
        </List>
      </View>
    );
  }
}

export default connect(
  state => ({ ...state.device.layout, ...state.settings }),
  dispatch => ({ dispatch })
)(OrderList);
