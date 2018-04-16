import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../styles';

export default class extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.grey1}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => this.props.navigation.goBack(null)}
          >
            <Icon name="arrow-back" color="white" size={15} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Mobidex',
          style: { color: 'white', fontSize: 18 }
        }}
      />
    );
  }
}
