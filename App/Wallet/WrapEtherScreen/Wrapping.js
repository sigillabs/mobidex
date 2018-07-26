import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../../styles';

export default class WrappingScreen extends Component {
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
        <Entypo
          name="chevron-with-circle-up"
          size={100}
          style={{ marginBottom: 25 }}
        />
        <Text style={styles.text}>Wrapping...</Text>
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
