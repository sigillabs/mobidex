import * as _ from 'lodash';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import NavigationService from '../services/NavigationService';

export default class SendTokensHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => NavigationService.goBack()}
          >
            <Icon name="arrow-back" color="black" size={15} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: this.renderTitle(),
          style: { color: 'black', fontSize: 18 }
        }}
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }

  renderTitle() {
    let symbol =
      this.props.token.symbol === null ? 'ETH' : this.props.token.symbol;
    if (symbol === 'WETH') symbol = 'ETH';
    return `Send ${symbol}`;
  }
}
