import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as WalletService from '../../../services/WalletService';
import { connect as connectNavigation } from '../../../../navigation';

export default class ChooseUnlockMethodScreen extends Component {
  static get propTypes() {
    return {
      error: PropTypes.object.isRequired
    };
  }

  async componentDidMount() {
    const error = this.props.error || false;
    const supportsFingerPrint = await WalletService.supportsFingerPrintUnlock();
    if (supportsFingerPrint) {
      this.props.navigation.push('navigation.tradeUnlockWithFinger', { error });
    } else {
      this.props.navigation.push('navigation.tradeUnlockWithPin', { error });
    }
  }

  render() {
    return null;
  }
}
