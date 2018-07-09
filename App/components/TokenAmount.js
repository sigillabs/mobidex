import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatAmount, getImage } from '../../utils';
import MutedText from './MutedText';
import BlinkingCursor from './BlinkingCursor';

export default class TokenAmount extends Component {
  render() {
    const {
      label,
      amount,
      avatarProps,
      symbol,
      name,
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
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, containerStyle]}>
          {label ? <MutedText>{label}</MutedText> : null}
          <View style={[styles.wrapper, wrapperStyle]}>
            <Avatar source={getImage(symbol)} {...avatarProps} />
            <View style={[styles.amountContainer, amountContainerStyle]}>
              <Text style={[amountStyle]}>
                {format ? formatAmount(amount) : amount.toString()}
              </Text>
              {cursor ? <BlinkingCursor /> : null}
            </View>
            <Text style={[{ marginLeft: 10 }, symbolStyle]}>
              {symbol.toUpperCase()}
            </Text>
            {name ? (
              <MutedText style={[{ marginLeft: 10 }, nameStyle]}>
                {name}
              </MutedText>
            ) : null}
          </View>
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
  format: PropTypes.bool,
  cursor: PropTypes.bool,
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
  symbolStyle: PropTypes.object,
  onPress: PropTypes.func
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
  container: { padding: 10 },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10
  },
  amountContainer: {
    width: 100,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
