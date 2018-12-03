import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect as connectNavigation } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import { navigationProp } from '../../../types/props';
import Loading from '../../views/Loading';
import UnlockWithTouchIdentification from './UnlockWithTouchIdentification';
import UnlockWithPin from './UnlockWithPin';
import Unlocking from './Unlocking';

class UnlockAndSignModal extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      next: PropTypes.func.isRequired,
      tx: PropTypes.object,
      message: PropTypes.string
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      previousScreen: null,
      screen: null,
      error: null,
      pin: null
    };
  }

  async componentDidMount() {
    if (!this.props.tx && !this.props.message) {
      return this.props.navigation.dismissModal();
    }

    const supportsFingerPrint = await WalletService.supportsFingerPrintUnlock();
    if (supportsFingerPrint) {
      this.showTouchIdentification();
    } else {
      this.showPin();
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const error = this.state.error;

    switch (this.state.screen) {
      case 0:
        return (
          <UnlockWithPin
            {...this.props}
            error={error}
            showUnlocking={this.showUnlocking}
          />
        );

      case 1:
        return (
          <UnlockWithTouchIdentification
            {...this.props}
            error={error}
            showUnlocking={this.showUnlocking}
          />
        );

      case 2:
        return (
          <Unlocking
            {...this.props}
            pin={this.state.pin}
            error={this.setError}
          />
        );

      default:
        return null;
    }
  }

  showPin = () => {
    this.setState({
      screen: 0,
      previousScreen: this.state.screen,
      loading: false,
      pin: null
    });
  };

  showTouchIdentification = () => {
    this.setState({
      screen: 1,
      previousScreen: this.state.screen,
      loading: false,
      pin: null
    });
  };

  showUnlocking = pin => {
    this.setState({
      screen: 2,
      previousScreen: this.state.screen,
      loading: false,
      pin
    });
  };

  setError = () => {
    this.setState({
      screen: this.state.previousScreen,
      previousScreen: null,
      error: true,
      loading: false
    });
  };
}

export default connectNavigation(UnlockAndSignModal);
