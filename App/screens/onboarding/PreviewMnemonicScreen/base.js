import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { styles } from '../../../../styles';
import { connect as connectNavigation } from '../../../../navigation';
import { navigationProp } from '../../../../types/props';
import Button from '../../../components/Button';
import DisplayMnemonic from '../../../components/DisplayMnemonic';
import MutedText from '../../../components/MutedText';
import Row from '../../../components/Row';

class BasePreviewMnemonicScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      generated: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      word: ''
    };
  }

  render() {
    const isGenerated = Boolean(this.props.generated);
    const mnemonic = this.props.mnemonic.slice();

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isGenerated ? (
          <MutedText>Please write down your seed phrase</MutedText>
        ) : (
          <MutedText>Is your seed entered correctly?</MutedText>
        )}
        <DisplayMnemonic
          containerStyle={[styles.mv3, { flex: 0, height: 260 }]}
          mnemonic={mnemonic}
        />
        <Row>
          {!isGenerated ? (
            <Button large title="Previous" onPress={this.previous} />
          ) : null}
          <Button large title="Next" onPress={this.next} />
        </Row>
      </View>
    );
  }

  previous = () => {
    const mnemonic = this.props.mnemonic;
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.push('navigation.onboarding.ImportMnemonic', {
        mnemonic,
        page: 11
      });
    });
  };

  next = () => {
    const mnemonic = this.props.mnemonic;

    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.push('navigation.onboarding.Pin', {
        mnemonic
      });
    });
  };
}

export default connectNavigation(BasePreviewMnemonicScreen);
