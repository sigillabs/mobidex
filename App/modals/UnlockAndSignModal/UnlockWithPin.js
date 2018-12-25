import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import MutedText from '../../components/MutedText';
import VerticalPadding from '../../components/VerticalPadding';
import PinKeyboardLayout from '../../layouts/PinKeyboardLayout';

class UnlockWithPin extends PinKeyboardLayout {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      error: PropTypes.object,
      showUnlocking: PropTypes.func.isRequired,
      cancel: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pin: [],
      focus: 'pin'
    };
  }

  renderTop() {
    return (
      <React.Fragment>
        <VerticalPadding size={50} />
        <MutedText style={[styles.textCenter]}>
          Unlock your wallet using your PIN.
        </MutedText>
      </React.Fragment>
    );
  }

  renderBottom() {
    return <Button title={'Cancel'} onPress={this.press} />;
  }

  press = () => {
    console.warn(this.props.navigation);
    this.props.navigation.dismissModal();
    this.props.cancel();
  };

  getKeyboardProps() {
    return {
      decimal: false
    };
  }

  finish(pin) {
    console.warn(pin);
    this.props.showUnlocking(pin.join(''));
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(UnlockWithPin)
);
