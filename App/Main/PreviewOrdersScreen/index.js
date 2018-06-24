import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import NavigationService from '../../services/NavigationService';
import FillOrdersPreview from './FillOrders';
import LimitOrderPreview from './LimitOrder';

export default class PreviewOrdersScreen extends Component {
  render() {
    const { type } = this.props.navigation.state.params;

    if (type !== 'limit' && type !== 'fill') {
      return NavigationService.goBack();
    }

    let subview = null;

    switch (type) {
      case 'fill':
        subview = <FillOrdersPreview {...this.props} />;
        break;

      case 'limit':
        subview = <LimitOrderPreview {...this.props} />;
        break;
    }

    return <View style={{ flex: 1, width: '100%' }}>{subview}</View>;
  }
}

PreviewOrdersScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
