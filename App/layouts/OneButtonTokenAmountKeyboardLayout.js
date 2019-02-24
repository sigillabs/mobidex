import React, { PureComponent } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { styles } from '../../styles';
import { processVirtualKeyboardCharacter } from '../../utils';
import Button from '../components/Button';

export default class OneButtonTokenAmountKeyboardLayout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      focus: 'amount'
    };
  }

  render() {
    return (
      <SafeAreaView style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            {this.renderTop()}
          </ScrollView>
        </View>
        <View style={[styles.flex0, styles.fluff0]}>
          <VirtualKeyboard
            color="black"
            pressMode="char"
            onPress={this.onChange.bind(this)}
            {...this.getKeyboardProps()}
          />
          <Button
            large
            onPress={this.press.bind(this)}
            containerStyle={[styles.fluff0, styles.mt1]}
            loadingStyle={styles.p2}
            {...this.getButtonProps()}
          />
        </View>
      </SafeAreaView>
    );
  }

  onChange(value) {
    const column = this.state.focus;
    const data = processVirtualKeyboardCharacter(value, this.state[column]);
    const derivedData = this.getDerivedAmount(column, data, this.state[column]);
    this.setColumn(column, derivedData);
  }

  setColumn(column, value) {
    this.setState({ [column]: value });
  }

  getDerivedAmount(column, newAmount, oldAmount) {
    return newAmount;
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
