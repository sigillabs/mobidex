import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../../styles';

export default class extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.grey1}
        statusBarProps={{ barStyle: 'light-content' }}
        centerComponent={{
          text: 'Mobidex',
          style: { color: 'white', fontSize: 18 }
        }}
      />
    );
  }
}
