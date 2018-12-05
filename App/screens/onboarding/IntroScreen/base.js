import React, { Component } from 'react';
import { Image } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../../../navigation';
import { navigationProp } from '../../../../types/props';
import * as WalletService from '../../../../services/WalletService';
import BigCenter from '../../../components/BigCenter';
import Button from '../../../components/Button';
import Padding from '../../../components/Padding';
import Row from '../../../components/Row';

class BaseIntro extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired
    };
  }

  render() {
    return (
      <BigCenter>
        <Image
          source={require('../../../../images/logo-with-text/logo-with-text-transparent.png')}
          style={{
            marginHorizontal: 0,
            width: '100%',
            resizeMode: Image.resizeMode.contain
          }}
        />
        <Padding size={20} />
        <Text h4>Trustlessly Trade ERC20 Tokens</Text>
        <Padding size={20} />
        <Text h6>
          To get started, import or generate a wallet. Remember to back this mnemonic up.
        </Text>
        <Padding size={20} />
        <Row>
          <Button
            large
            title="Generate"
            onPress={() => this.generateWallet()}
          />
          <Button
            large
            title="Import"
            onPress={() =>
              this.props.navigation.push('navigation.onboarding.ImportMnemonic')
            }
          />
        </Row>
      </BigCenter>
    );
  }

  async generateWallet() {
    try {
      const mnemonic = await WalletService.generateMnemonics();
      this.props.navigation.push('navigation.onboarding.PreviewMnemonic', {
        mnemonic: mnemonic.split(/\s+/),
        generated: true
      });
    } catch (err) {
      console.warn(err);
      return;
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(BaseIntro)
);
