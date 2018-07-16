import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../../styles';

export default class CancellingOrdersScreen extends Component {
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
        <Entypo name="block" size={100} style={{ marginBottom: 25 }} />
        <Text style={styles.text}>Cancelling order</Text>
        <ActivityIndicator size="large" color={colors.gray1} />
      </View>
    );
  }
}

const styles = {
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 10
  }
};
