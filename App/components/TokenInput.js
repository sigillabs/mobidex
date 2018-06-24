import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import { getImage } from '../../utils';
import DismissableKeyboard from './DismissableKeyboard';
import MutedText from './MutedText';

export default class TokenInput extends Component {
  render() {
    const {
      avatarProps,
      label,
      token,
      amount,
      onChange,
      containerStyle,
      inputStyle,
      nameStyle,
      symbolStyle,
      wrapperStyle,
      ...rest
    } = this.props;
    const { name, symbol } = token;

    return (
      <DismissableKeyboard>
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
            {/*<TextInputMask
            style={[{ width: 100, marginLeft: 10 }, inputStyle]}
            type={'money'}
            value={amount}
            onChangeText={onChange}
            options={{
              precision: 4,
              unit: '',
              separator: '.',
              delimiter: ',',
              zeroCents: false
            }}
          />*/}
            <TextInputMask
              style={[{ width: 100, marginLeft: 10 }, inputStyle]}
              type={'custom'}
              keyboardType={'numeric'}
              value={amount}
              onChangeText={onChange}
              // checkText={(previous, next) => {
              //   return /^\d+(\.\d*)?$/.test(next);
              // }}
              options={{
                mask: '9999.999999',
                validator: value => {
                  // return /^\d+(\.\d+)?$/.test(value);
                  return true;
                },
                getRawValue: value => {
                  return value.replace(/\s+/gi, '').replace(/[a-zA-Z]+/gi, '');
                }
              }}
              {...rest}
            />

            <Text style={[{ marginLeft: 10 }, symbolStyle]}>
              {symbol.toUpperCase()}
            </Text>
            <MutedText style={[{ marginLeft: 10 }, nameStyle]}>
              {name}
            </MutedText>
          </View>
          <Divider />
        </View>
      </DismissableKeyboard>
    );
  }
}

TokenInput.propTypes = {
  avatarProps: PropTypes.shape({
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    xlarge: PropTypes.bool
  }),
  label: PropTypes.string,
  token: PropTypes.object,
  amount: PropTypes.string,
  onChange: PropTypes.func,
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  nameStyle: PropTypes.object,
  symbolStyle: PropTypes.object,
  wrapperStyle: PropTypes.object
};

TokenInput.defaultProps = {
  avatarProps: {
    medium: true,
    rounded: true,
    activeOpacity: 0.7,
    overlayContainerStyle: { backgroundColor: 'transparent' }
  }
};
