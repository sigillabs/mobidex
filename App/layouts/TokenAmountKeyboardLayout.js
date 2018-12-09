import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { styles } from '../../styles';
import { processVirtualKeyboardCharacter } from '../../utils';
import Button from '../components/Button';

export default class TokenAmountKeyboardLayout extends PureComponent {
  static get defaultProps() {
    return {
      buttonTitle: 'Submit',
      disableButton: false
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      focus: 'amount'
    };
  }

  render() {
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            {this.renderTop()}
          </ScrollView>
        </View>
        <View style={[styles.flex0, styles.fluff0]}>
          <VirtualKeyboard
            color="black"
            pressMode="char"
            onPress={this.onChange}
            {...this.getKeyboardProps()}
          />
          <Button
            large
            onPress={this.onPress}
            containerStyle={[styles.fluff0]}
            loadingStyle={styles.p2}
            {...this.getButtonProps()}
          />
        </View>
      </View>
    );
  }

  onChange = value => {
    const column = this.state.focus;
    const data = processVirtualKeyboardCharacter(value, this.state[column]);
    this.setColumn(column, data);
  };

  onPress = () => {
    this.press();
  };

  setColumn(column, value) {
    this.setState({ [column]: value });
  }

  getKeyboardProps() {
    throw new Error('getKeyboardProps must be implemented.');
  }

  getButtonProps() {
    throw new Error('getButtonProps must be implemented.');
  }

  renderTop() {
    throw new Error('renderTop must be implemented.');
  }

  press() {
    throw new Error('submit must be implemented.');
  }
}
