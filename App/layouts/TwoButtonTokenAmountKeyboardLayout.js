import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { styles } from '../../styles';
import { processVirtualKeyboardCharacter } from '../../utils';
import Button from '../components/Button';
import Row from '../components/Row';

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
            onPress={this.onChange.bind(this)}
            {...this.getKeyboardProps()}
          />
          <Row style={[styles.flex0, styles.fluff0]}>
            <Button
              large
              onPress={this.pressLeft.bind(this)}
              containerStyle={[styles.fluff0, styles.flex1]}
              loadingStyle={styles.p2}
              {...this.getButtonLeftProps()}
            />
            <Button
              large
              onPress={this.pressRight.bind(this)}
              containerStyle={[styles.fluff0, styles.flex1]}
              loadingStyle={styles.p2}
              {...this.getButtonRightProps()}
            />
          </Row>
        </View>
      </View>
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

  getButtonLeftProps() {
    throw new Error('getButtonLeftProps must be implemented.');
  }

  getButtonRightProps() {
    throw new Error('getButtonRightProps must be implemented.');
  }

  renderTop() {
    throw new Error('renderTop must be implemented.');
  }

  pressLeft() {
    throw new Error('pressLeft must be implemented.');
  }

  pressRight() {
    throw new Error('pressRight must be implemented.');
  }
}
