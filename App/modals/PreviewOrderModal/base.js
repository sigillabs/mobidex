import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { connect as connectNavigation } from '../../../navigation';
import { navigationProp } from '../../../types/props';
import FillOrdersPreview from './FillOrders';
import LimitOrderPreview from './LimitOrder';

class BasePreviewOrderModal extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      type: PropTypes.string.isRequired,
      quote: PropTypes.object.isRequired,
      base: PropTypes.object.isRequired
    };
  }

  render() {
    const { type, ...rest } = this.props;

    if (type !== 'limit' && type !== 'fill') {
      return this.props.navigation.pop();
    }

    let subview = null;

    switch (type) {
      case 'fill':
        subview = <FillOrdersPreview {...rest} />;
        break;

      case 'limit':
        subview = <LimitOrderPreview {...rest} />;
        break;
    }

    return <SafeAreaView style={{ flex: 1 }}>{subview}</SafeAreaView>;
  }
}

export default connectNavigation(BasePreviewOrderModal);

BasePreviewOrderModal.propTypes = {
  type: PropTypes.string.isRequired,
  quote: PropTypes.object.isRequired,
  base: PropTypes.object.isRequired
};
