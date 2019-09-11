import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatAmount, formatSymbol, getImage } from '../../lib/utils';
import FormattedSymbol from './FormattedSymbol';
import MutedText from './MutedText';
import BlinkingCursor from './BlinkingCursor';

export default class InputTokenAmount extends Component {
  static get propTypes() {
    return {
      label: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
        .isRequired,
      symbol: PropTypes.string,
      name: PropTypes.string,
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
      nameStyle: PropTypes.object,
      symbolStyle: PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      avatarProps: {
        medium: true,
        rounded: true,
        activeOpacity: 0.7,
        overlayContainerStyle: { backgroundColor: 'transparent' }
      },
      format: true
    };
  }

  render() {
    return (
      <Fragment>
        {this.renderLabel()}
        <View style={[style.wrapper]}>
          {this.renderIcon()}
          {this.renderAmount()}
          {this.renderSymbol()}
          {this.renderName()}
        </View>
      </Fragment>
    );
  }

  renderAmount() {
    const {
      amount,
      amountStyle,
      amountContainerStyle,
      cursor,
      format
    } = this.props;

    if (typeof amount === 'string') {
      const formattedAmount = format ? formatAmount(amount) : amount.toString();

      return (
        <View style={[style.amountContainer, amountContainerStyle]}>
          <Text style={[amountStyle]}>{formattedAmount}</Text>
          {cursor ? <BlinkingCursor /> : null}
        </View>
      );
    } else {
      return (
        <View style={[style.amountContainer, amountContainerStyle]}>
          {amount}
        </View>
      );
    }
  }

  renderIcon() {
    const { avatarProps, icon, symbol } = this.props;

    if (icon) {
      return icon;
    }

    if (symbol) {
      return (
        <Avatar source={getImage(formatSymbol(symbol))} {...avatarProps} />
      );
    }

    return null;
  }

  renderLabel() {
    const { label } = this.props;

    if (!label) {
      return null;
    }

    return <MutedText>{label}</MutedText>;
  }

  renderName() {
    const { name, nameStyle } = this.props;

    if (!name) {
      return null;
    }

    return <MutedText style={[style.name, nameStyle]}>{name}</MutedText>;
  }

  renderSymbol() {
    const { symbol, symbolStyle } = this.props;

    if (!symbol) {
      return null;
    }

    return (
      <FormattedSymbol symbol={symbol} style={[style.symbol, symbolStyle]} />
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    flex: 0,
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
