import React, { PureComponent } from 'react';
import { SafeAreaView, View } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { styles } from '../../styles';
import { processVirtualKeyboardCharacter } from '../../utils';
import PinView from '../components/PinView';

export default class PinKeyboardLayout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pin: []
    };
  }

  render() {
    return (
      <SafeAreaView style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100, styles.center]}>
          {this.renderTop()}
          <PinView
            value={this.state.pin.join('')}
            containerStyle={[styles.mv2]}
          />
        </View>
        <View style={[styles.flex0, styles.fluff0]}>
          <VirtualKeyboard
            color="black"
            pressMode="char"
            onPress={this.onChange.bind(this)}
            {...this.getKeyboardProps()}
            decimal={false}
          />
          {this.renderBottom()}
        </View>
      </SafeAreaView>
    );
  }

  onChange(value) {
    const pin = processVirtualKeyboardCharacter(value, this.state.pin);

    if (pin.length === 6) {
      this.finish(pin);
    } else if (pin.length > 6) {
      this.restart(pin);
    } else {
      this.setState({ pin });
    }
  }

  restart(pin) {
    this.setState({ pin: pin.slice(6) });
  }

  getKeyboardProps() {
    throw new Error('getKeyboardProps must be implemented.');
  }

  renderTop() {
    throw new Error('renderTop must be implemented.');
  }

  renderBottom() {
    throw new Error('renderBottom must be implemented.');
  }

  finish(pin) {
    throw new Error('finish must be implemented.');
  }
}
