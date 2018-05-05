import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Divider, Input, Text } from 'react-native-elements';
import { MKTextField, TextInputMask } from 'react-native-masked-text';
import { formatAmount, getImage } from '../../utils';
import Logo from './Logo';
import MutedText from './MutedText';

export default class TokenAmount extends Component {
  render() {
    const { avatarProps, label, token, onChange, amount, ...more } = this.props;
    const {
      amountStyle,
      containerStyle,
      inputStyle,
      labelStyle,
      nameStyle,
      symbolStyle,
      wrapperStyle
    } = more;
    const { decimals, name, symbol } = token;

    return (
      <View style={[{ padding: 20 }, containerStyle]}>
        {label ? <MutedText>{label}</MutedText> : null}
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 10
            },
            wrapperStyle
          ]}
        >
          <Avatar source={getImage(symbol)} {...avatarProps} />
          <TextInputMask
            ref={'myDateText'}
            type={'money'}
            style={[{ width: 100, marginLeft: 10 }, inputStyle]}
            value={amount}
            onChangeText={onChange}
            options={{
              precision: 6,
              unit: '',
              separator: '.',
              delimiter: ','
            }}
          />

          <Text style={[{ marginLeft: 10 }, symbolStyle]}>
            {symbol.toUpperCase()}
          </Text>
          <MutedText style={[{ marginLeft: 10 }, nameStyle]}>{name}</MutedText>
        </View>
        <Divider />
      </View>
    );
  }
}
