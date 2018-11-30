import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { styles } from '../../../styles';
import { push } from '../../../navigation';
import Button from '../../components/Button';
import DisplayMnemonic from '../../components/DisplayMnemonic';
import MutedText from '../../components/MutedText';
import Row from '../../components/Row';

export default class PreviewMnemonicScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: ''
    };
  }

  static get propTypes() {
    return {
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      generated: PropTypes.bool
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
            <Button large title="Previous" onPress={() => this.previous()} />
          ) : null}
          <Button large title="Next" onPress={() => this.next()} />
        </Row>
      </View>
    );
  }

  previous() {
    const mnemonic = this.props.mnemonic;
    InteractionManager.runAfterInteractions(() => {
      push('navigation.onboarding.ImportMnemonic', {
        mnemonic,
        page: 11
      });
    });
  }

  next() {
    const mnemonic = this.props.mnemonic;

    InteractionManager.runAfterInteractions(() => {
      push('navigation.onboarding.Pin', {
        mnemonic
      });
    });
  }
}
