import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import WyreVerification from 'wyre-react-native-library';

class WyreVerificationScreen extends Component {
  render() {
    return (
      <WyreVerification.default
        apiKey={'AK-2EENE77W-X6YRC6VJ-8GTF73WL-QQ92BZ28'}
        networkId={this.props.network}
        web3={this.props.web3}
      />
    );
  }
}

WyreVerificationScreen.propTypes = {
  network: PropTypes.number.isRequired,
  web3: PropTypes.object.isRequired
};

export default connect(
  state => ({ ...state.settings, ...state.wallet }),
  dispatch => ({ dispatch })
)(WyreVerificationScreen);
