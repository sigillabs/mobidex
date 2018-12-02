import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Clipboard, InteractionManager, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../../styles';
import { connect as connectNavigation } from '../../../../navigation';
import { navigationProp } from '../../../../types/props';
import Button from '../../../components/Button';
import MnemonicWordInput from '../../../components/MnemonicWordInput';
import MutedText from '../../../components/MutedText';
import Row from '../../../components/Row';

class BaseImportMnemonicScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      page: PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      word: '',
      submitting: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    const mnemonic = (props.mnemonic || []).slice();
    const page = props.page || 0;
    const word = mnemonic[page];

    return {
      ...state,
      word: word || '',
      submitting: false
    };
  }

  render() {
    const page = this.props.page || 0;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 20
        }}
      >
        <MutedText>
          Enter word {page + 1} of your 12 word seed phrase.
        </MutedText>
        <MnemonicWordInput
          word={this.state.word}
          onChange={word => this.onChangeWord(word)}
          onSubmit={() => this.submit()}
          cellStyle={{ flex: 0, marginTop: 20 }}
          autofocus={true}
          disabled={this.state.submitting}
        />
        {this.state.mnemonicError ? (
          <Text style={{ color: colors.error }}>
            Mnemonic must be 12 english words.
          </Text>
        ) : (
          <Text style={{ color: colors.error }}> </Text>
        )}
        <Row>
          <Button
            large
            title="Previous"
            onPress={() => this.previous()}
            disabled={page <= 0}
          />

          <Button large title="Paste" onPress={() => this.paste()} />

          <Button
            large
            title="Next"
            onPress={() => this.next()}
            disabled={!this.validateWord() || this.state.submitting}
          />
        </Row>
      </View>
    );
  }

  onChangeWord(word) {
    this.setState({ word });
  }

  validateWord() {
    return Boolean(this.state.word);
  }

  validateMnemonic() {
    const mnemonic = (this.props.mnemonic || []).slice();
    mnemonic.push(this.state.word);

    return (
      mnemonic &&
      mnemonic.length === 12 &&
      mnemonic.reduce((all, word) => all && Boolean(word), true)
    );
  }

  async paste() {
    this.setState({ submitting: true });
    const addMnemonic = ((await Clipboard.getString()) || '')
      .split(/\s+/)
      .filter(word => Boolean(word));

    if (addMnemonic.length === 0) return;

    const page = this.props.page || 0;
    const mnemonic = (this.props.mnemonic || []).slice();
    mnemonic.splice.apply(
      mnemonic,
      [page, addMnemonic.length].concat(addMnemonic)
    );

    InteractionManager.runAfterInteractions(() => {
      if (mnemonic.length >= 12) {
        this.props.navigation.push('navigation.onboarding.PreviewMnemonic', {
          mnemonic
        });
      } else {
        this.props.navigation.push('navigation.onboarding.ImportMnemonic', {
          mnemonic,
          page: mnemonic.length
        });
      }
    });
  }

  previous() {
    const mnemonic = this.props.mnemonic || [];
    const page = this.props.page || 0;

    if (page <= 0) return;

    this.props.navigation.push('navigation.onboarding.ImportMnemonic', {
      mnemonic,
      page: page - 1
    });
  }

  next() {
    this.setState({ submitting: true });

    const page = this.props.page || 0;
    const mnemonic = (this.props.mnemonic || []).slice();
    mnemonic[page] = this.state.word;

    this.navigate(mnemonic.filter(word => Boolean(word)));
  }

  navigate(mnemonic) {
    const page = this.props.page || 0;

    InteractionManager.runAfterInteractions(() => {
      if (page >= 11) {
        this.props.navigation.push('navigation.onboarding.PreviewMnemonic', {
          mnemonic
        });
      } else {
        this.props.navigation.push('navigation.onboarding.ImportMnemonic', {
          mnemonic,
          page: page + 1
        });
      }
    });
  }
}

export default connectNavigation(BaseImportMnemonicScreen);
