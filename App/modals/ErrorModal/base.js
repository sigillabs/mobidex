import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect as connectNavigation } from '../../../navigation';
import { colors } from '../../../styles';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import Button from '../../components/Button.js';
import AssetBuyerError from './AssetBuyerError';
import RelayerError from './RelayerError';
import TokenError from './TokenError';
import ZeroExError from './ZeroExError';

class BaseErrorModal extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      error: PropTypes.object
    };
  }

  renderAssetBuyerErrors() {
    const error = this.props.error;
    return <AssetBuyerError error={error} />;
  }

  renderRelayerErrors() {
    const error = this.props.error;
    return <RelayerError error={error} />;
  }

  renderTokenError() {
    const error = this.props.error;
    return <TokenError error={error} />;
  }

  renderZeroEx() {
    const error = this.props.error;
    return <ZeroExError error={error} />;
  }

  renderMessage() {
    const error = this.props.error;
    if (!error || !error.message) {
      return this.renderGeneral();
    }
    const message = error.message;

    if (AssetBuyerError.test(error)) {
      return this.renderAssetBuyerErrors();
    } else if (RelayerError.test(error)) {
      return this.renderRelayerErrors();
    } else if (TokenError.test(error)) {
      return this.renderTokenError();
    } else if (ZeroExError.test(error)) {
      return this.renderZeroEx();
    } else {
      return <Text style={styles.text}>{message}</Text>;
    }
  }

  renderGeneral() {
    return <Text style={styles.text}>Something went wrong :-/.</Text>;
  }

  render() {
    return (
      <BigCenter>
        <Entypo name="emoji-sad" size={100} style={{ marginBottom: 25 }} />
        <View>{this.renderMessage()}</View>
        <Button
          large
          title="Get Out Of Here"
          icon={<Entypo name="arrow-with-circle-left" color="white" />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.props.navigation.dismissModal}
        />
      </BigCenter>
    );
  }
}

export default connectNavigation(BaseErrorModal);

const styles = {
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 10,
    textAlign: 'center'
  }
};
