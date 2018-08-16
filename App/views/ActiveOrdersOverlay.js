import ethUtil from 'ethereumjs-util';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NumberOverlay from '../components/NumberOverlay';

export class ActiveOrdersOverlay extends Component {
  render() {
    const orders = this.props.orders.filter(
      order =>
        ethUtil.stripHexPrefix(order.maker) ===
        ethUtil.stripHexPrefix(this.props.address)
    );
    return <NumberOverlay {...this.props} value={orders.length} />;
  }
}

ActiveOrdersOverlay.propTypes = {
  children: PropTypes.any,
  orders: PropTypes.array.isRequired,
  address: PropTypes.string.isRequired
};

export default connect(({ relayer: { orders }, wallet: { address } }) => ({
  address,
  orders
}))(ActiveOrdersOverlay);
