import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as WalletService from '../../services/WalletService';
import NavigationService from '../../services/NavigationService';

export default class ChooseUnlockMethodScreen extends Component {
  static get propTypes() {
    return {
      navigation: PropTypes.shape({ getParam: PropTypes.func.isRequired })
        .isRequired
    };
  }

  async componentDidMount() {
    const error = this.props.navigation.getParam('error') || false;
    const supportsFingerPrint = await WalletService.supportsFingerPrintUnlock();
    if (supportsFingerPrint) {
      NavigationService.navigate('UnlockWithFinger', { error });
    } else {
      NavigationService.navigate('UnlockWithPin', { error });
    }
  }

  render() {
    return null;
  }
}
