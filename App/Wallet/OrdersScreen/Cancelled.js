import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TimerMixin from 'react-timer-mixin';
import { colors } from '../../../styles';

@reactMixin.decorate(TimerMixin)
export default class CancellingOrdersScreen extends Component {
  componentDidMount() {
    this.setTimeout(() => this.props.onLeave(), 3000);
  }

  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <TouchableOpacity onPress={() => this.props.onLeave()}>
          <EvilIcons name="check" size={50} color={colors.success} />
          <Text h1>Order successfully cancelled.</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
