import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Button from '../components/Button.js';
import { colors } from '../../styles';

class Err extends Component {
  render() {
    const { message, stack } = this.props.navigation.getParam('error');

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
        <Text
          style={{
            fontSize: 18,
            color: 'white',
            paddingBottom: 10
          }}
        >
          {message}
        </Text>
        <Button
          large
          title="Get Out Of Here"
          icon={<Icon name="refresh" color="white" />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(Err);
