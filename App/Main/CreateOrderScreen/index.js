import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ButtonGroup from '../../components/ButtonGroup';
import FillOrders from './FillOrders';
import LimitOrder from './LimitOrder';

const BUTTONS = ['Fill Orders', 'Market Order', 'Limit Order'];
const TYPES = ['fill', 'limit', 'limit'];

export default class CreateOrderScreen extends Component {
  render() {
    const {
      type,
      side,
      product: { base, quote }
    } = this.props.navigation.state.params;

    let subview = null;
    let index = 0;

    switch (type) {
      case 'fill':
        index = 0;
        subview = <FillOrders {...this.props} />;
        break;

      case 'market':
        index = 1;
        subview = <LimitOrder {...this.props} />;
        break;

      case 'limit':
        index = 2;
        subview = <LimitOrder {...this.props} />;
        break;
    }

    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ButtonGroup
          onPress={index =>
            this.props.navigation.push('CreateOrder', {
              product: { base, quote },
              type: TYPES[index],
              side: side
            })
          }
          selectedIndex={index}
          buttons={BUTTONS}
          containerStyle={{ marginBottom: 20 }}
        />
        {subview}
      </ScrollView>
    );
  }
}
