import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../../styles';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

export default class FillingOrdersScreen extends Component {
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
        <RotatingView>
          <Entypo
            name="chevron-with-circle-up"
            size={100}
            style={{ marginBottom: 25 }}
          />
        </RotatingView>
        <Padding size={25} />
        <Text style={styles.text}>{this.props.text}</Text>
        <Padding size={25} />
        <Padding size={25} />
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
