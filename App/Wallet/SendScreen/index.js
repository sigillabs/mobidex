import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux';
import { sendEther, sendTokens } from '../../../thunks';
import AmountPage from './AmountPage';
import AccountPage from './AccountPage';
import Sending from './Sending';

@reactMixin.decorate(TimerMixin)
class SendTokensWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      address: '',
      page: 0,
      showSending: false
    };
  }

  render() {
    const {
      navigation: {
        state: {
          params: { token }
        }
      }
    } = this.props;

    if (this.state.showSending) {
      return <Sending />;
    }

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {this.state.page === 0 ? (
          <AmountPage
            token={token}
            onSubmit={amount => this.submitAmount(amount)}
          />
        ) : null}
        {this.state.page === 1 ? (
          <AccountPage
            token={token}
            amount={this.state.amount}
            onSubmit={address => this.submitAddress(address)}
          />
        ) : null}
      </View>
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
    const {
      navigation: {
        state: {
          params: { token }
        }
      }
    } = this.props;

    this.setState({ showSending: true });
    this.props.navigation.setParams({ hideHeader: true });

    InteractionManager.runAfterInteractions(async () => {
      try {
        if (token.address === null) {
          await this.props.dispatch(
            sendEther(address || this.state.address, this.state.amount)
          );
        } else {
          await this.props.dispatch(
            sendTokens(token, address || this.state.address, this.state.amount)
          );
        }
        this.props.navigation.goBack(null);
      } catch (err) {
        console.warn(err);
        return;
      } finally {
        this.setState({ showSending: false });
        this.props.navigation.setParams({ hideHeader: false });
      }
    });
  }
}

export default connect(state => ({ ...state }), dispatch => ({ dispatch }))(
  SendTokensWizard
);

SendTokensWizard.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
