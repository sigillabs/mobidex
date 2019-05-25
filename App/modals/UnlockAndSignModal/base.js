import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect as connectNavigation } from '../../../navigation';
import { WalletService } from '../../../services/WalletService';
import { navigationProp } from '../../../types/props';
import Loading from '../../views/Loading';
import UnlockWithTouchIdentification from './UnlockWithTouchIdentification';
import UnlockWithFaceIdentification from './UnlockWithFaceIdentification';
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
      forceShowPin: false,
      screen: null,
      error: null,
      pin: null,
      isFaceID: false
    };
  }

  async componentDidMount() {
    if (!this.props.tx && !this.props.message) {
      return this.props.navigation.dismissModal();
    }

    const supportsFingerPrint = await WalletService.instance.supportsFingerPrintUnlock();
    const supportsFaceID = await WalletService.instance.supportsFaceIDUnlock();
    if (supportsFingerPrint && !this.forceShowPin) {
      this.showTouchIdentification();
    } else if (supportsFaceID && !this.forceShowPin) {
      this.showFaceIdentification();
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
            cancel={this.cancel}
            showUnlocking={this.showUnlocking}
          />
        );

      case 1:
        return (
          <UnlockWithTouchIdentification
            {...this.props}
            error={error}
            cancel={this.cancel}
            showUnlocking={this.showUnlocking}
            showPin={this.showPin}
          />
        );

      case 2:
        return (
          <UnlockWithFaceIdentification
            {...this.props}
            error={error}
            cancel={this.cancel}
            showUnlocking={this.showUnlocking}
            showPin={this.showPin}
          />
        );

      case 3:
        return (
          <Unlocking
            {...this.props}
            pin={this.state.pin}
            error={this.setError}
            isFaceID={this.state.isFaceID}
          />
        );

      default:
        return null;
    }
  }

  cancel = () => this.props.next();

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

  showFaceIdentification = () => {
    this.setState({
      screen: 2,
      previousScreen: this.state.screen,
      loading: false,
      pin: null
    });
  };

  showUnlocking = (pin, isFaceID) => {
    this.setState({
      screen: 3,
      previousScreen: this.state.screen,
      loading: false,
      pin,
      isFaceID
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
