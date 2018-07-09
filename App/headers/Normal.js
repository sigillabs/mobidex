import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

export default class NormalHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          this.props.showBackButton ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.props.navigation.goBack(null)}
            >
              <Icon name="arrow-back" color="black" size={15} />
            </TouchableOpacity>
          ) : null
        }
        centerComponent={{
          text: this.props.title || 'Mobidex',
          style: { color: 'black', fontSize: 18 }
        }}
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}
