import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../../constants/0x';
import { sendEther, sendTokens } from '../../../../thunks';
import { connect as connectNavigation } from '../../../../navigation';
import AmountPage from './AmountPage';
import AccountPage from './AccountPage';
import Sending from './Sending';

class BaseSendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: ZERO,
      address: '',
      page: 0,
      showSending: false
    };
  }

  render() {
    const { asset } = this.props;

    if (this.state.showSending) {
      return <Sending />;
    }

    return (
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          flex: 1
        }}
      >
        {this.state.page === 0 ? (
          <AmountPage
            asset={asset}
            onSubmit={amount => this.submitAmount(amount)}
          />
        ) : null}
        {this.state.page === 1 ? (
          <AccountPage
            asset={asset}
            amount={this.state.amount}
            onSubmit={address => this.submitAddress(address)}
          />
        ) : null}
      </ScrollView>
    );
  }

  submitAmount(amount) {
    this.setState({ amount: new BigNumber(amount), page: 1 });
  }

  submitAddress(address) {
    this.setState({ address });
    this.submit(address);
  }

  submit(address) {
    const { asset } = this.props;

    this.setState({ showSending: true });

    InteractionManager.runAfterInteractions(async () => {
      try {
        if (asset.address === null) {
          await this.props.dispatch(
            sendEther(address || this.state.address, this.state.amount)
          );
        } else {
          await this.props.dispatch(
            sendTokens(asset, address || this.state.address, this.state.amount)
          );
        }
        this.props.navigation.pop();
      } catch (err) {
        console.warn(err);
        return;
      } finally {
        this.setState({ showSending: false });
      }
    });
  }
}

export default connect(state => ({ ...state }), dispatch => ({ dispatch }))(
  connectNavigation(BaseSendScreen)
);

BaseSendScreen.propTypes = {
  asset: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};
