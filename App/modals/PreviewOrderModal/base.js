import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect as connectNavigation } from '../../../navigation';
import PageRoot from '../../components/PageRoot';
import FillOrdersPreview from './FillOrders';
import LimitOrderPreview from './LimitOrder';

class BasePreviewOrderModal extends Component {
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

    return <PageRoot style={{ flex: 1 }}>{subview}</PageRoot>;
  }
}

export default connectNavigation(BasePreviewOrderModal);

BasePreviewOrderModal.propTypes = {
  type: PropTypes.string.isRequired,
  quote: PropTypes.object.isRequired,
  base: PropTypes.object.isRequired
};
