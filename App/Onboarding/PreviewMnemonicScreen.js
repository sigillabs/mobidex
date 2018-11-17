import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { styles } from '../../styles';
import NavigationService from '../../services/NavigationService';
import Button from '../components/Button';
import DisplayMnemonic from '../components/DisplayMnemonic';
import MutedText from '../components/MutedText';
import Row from '../components/Row';

export default class PreviewMnemonicScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: ''
    };
  }

  static get propTypes() {
    return {
      navigation: PropTypes.shape({
        getParam: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({
            mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
            generated: PropTypes.bool
          }).isRequired
        }).isRequired
      }).isRequired
    };
  }

  render() {
    const isGenerated = Boolean(this.props.navigation.getParam('generated'));
    const mnemonic = this.props.navigation.getParam('mnemonic').slice();

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
    const mnemonic = this.props.navigation.getParam('mnemonic');
    InteractionManager.runAfterInteractions(() => {
      NavigationService.navigate('ImportMnemonic', {
        mnemonic,
        page: 11
      });
    });
  }

  next() {
    const mnemonic = this.props.navigation.getParam('mnemonic');

    InteractionManager.runAfterInteractions(() => {
      NavigationService.navigate('ImportPin', {
        mnemonic
      });
    });
  }
}
