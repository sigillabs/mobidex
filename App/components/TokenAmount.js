import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatAmount, formatSymbol, getImage } from '../../utils';
import FormattedSymbol from './FormattedSymbol';
import MutedText from './MutedText';
import BlinkingCursor from './BlinkingCursor';

export default class TokenAmount extends Component {
  render() {
    const {
      label,
      amount,
      icon,
      avatarProps,
      symbol,
      name,
      right,
      format,
      cursor,
      onPress,
      ...more
    } = this.props;
    const {
      amountStyle,
      amountContainerStyle,
      containerStyle,
      wrapperStyle,
      nameStyle,
      symbolStyle
    } = more;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, containerStyle]}
      >
        {label ? <MutedText>{label}</MutedText> : null}
        <View style={[styles.wrapper, wrapperStyle]}>
          {icon ? (
            icon
          ) : (
            <Avatar source={getImage(formatSymbol(symbol))} {...avatarProps} />
          )}
          <View style={[styles.amountContainer, amountContainerStyle]}>
            <Text style={[amountStyle]}>
              {format ? formatAmount(amount) : amount.toString()}
            </Text>
            {cursor ? <BlinkingCursor /> : null}
          </View>
          {symbol ? (
            <FormattedSymbol
              name={symbol}
              style={[styles.symbol, symbolStyle]}
            />
          ) : null}
          {name ? (
            <MutedText style={[styles.name, nameStyle]}>{name}</MutedText>
          ) : null}
          {right ? right : null}
        </View>
      </TouchableOpacity>
    );
  }
}

TokenAmount.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string,
  right: PropTypes.element,
  format: PropTypes.bool,
  cursor: PropTypes.bool,
  onPress: PropTypes.func,
  icon: PropTypes.element,
  avatarProps: PropTypes.shape({
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    xlarge: PropTypes.bool
  }),
  cursorProps: PropTypes.object,
  amountStyle: PropTypes.object,
  amountContainerStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  nameStyle: PropTypes.object,
  symbolStyle: PropTypes.object
};

TokenAmount.defaultProps = {
  avatarProps: {
    medium: true,
    rounded: true,
    activeOpacity: 0.7,
    overlayContainerStyle: { backgroundColor: 'transparent' }
  },
  format: true
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    height: 60
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10
  },
  amountContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  symbol: { flex: 0, marginLeft: 10 },
  name: { flex: 0, marginLeft: 10 }
});
