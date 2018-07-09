import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PageRoot from '../../components/PageRoot';
import Tabs from '../../components/Tabs';
import FillOrders from './FillOrders';
import LimitOrder from './LimitOrder';

const BUTTONS = ['Fill Orders', 'Limit Order'];
const TYPES = ['fill', 'limit'];

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

      case 'limit':
        index = 1;
        subview = <LimitOrder {...this.props} />;
        break;
    }

    return (
      <PageRoot>
        <Tabs
          onPress={index =>
            this.props.navigation.replace('CreateOrder', {
              product: { base, quote },
              type: TYPES[index],
              side: side
            })
          }
          selectedIndex={index}
          buttons={BUTTONS}
        />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {subview}
        </ScrollView>
      </PageRoot>
    );
  }
}

CreateOrderScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string.isRequired,
        side: PropTypes.string.isRequired,
        product: PropTypes.shape({
          base: PropTypes.object.isRequired,
          quote: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
