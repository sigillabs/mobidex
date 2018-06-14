import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

export default class BlankHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        outerContainerStyles={{ height: 30, borderBottomWidth: 0 }}
      />
    );
  }
}
