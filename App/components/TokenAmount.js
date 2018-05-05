import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatAmount, getImage } from '../../utils';
import Logo from './Logo';
import MutedText from './MutedText';

export default class TokenAmount extends Component {
  render() {
    const { amount, avatarProp, token, ...more } = this.props;
    const {
      amountStyle,
      containerStyle,
      nameStyle,
      symbolStyle,
      ...rest
    } = more;
    const { decimals, name, symbol } = token;

    return (
      <View
        {...rest}
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          constainerStyle
        ]}
      >
        <Avatar source={getImage(symbol)} {...avatarProps} />
        <Text style={[amountStyle]}>{formatAmount(amount)}</Text>
        <Text style={[symbolStyle]}>{symbol.toUpperCase()}</Text>
        <MutedText style={[nameStyle]}>{name}</MutedText>
      </View>
    );
  }
}
