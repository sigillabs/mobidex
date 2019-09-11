import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import {fonts, images, styles} from '../../styles';
import {BigNumberProp} from '../../types/props';
import {formatAmount, getImage} from '../../lib/utils';
import Row from './Row';
import EthereumAmount from './EthereumAmount';

export default class TokenIcon extends Component {
  static get propTypes() {
    return {
      amount: BigNumberProp,
      unit: PropTypes.string,
      containerStyle: PropTypes.object,
      avatarProps: PropTypes.object,
      amountProps: PropTypes.object,
      labelProps: PropTypes.object,
      showName: PropTypes.bool,
      showSymbol: PropTypes.bool,
      showAmount: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      unit: 'ether',
      showName: false,
      showSymbol: true,
      showAmount: true,
    };
  }

  render() {
    const {
      amount,
      unit,
      containerStyle,
      avatarProps,
      amountProps,
      labelProps,
      showName,
      showSymbol,
      showAmount,
      ...rest
    } = this.props;
    const {symbol, name} = AssetService.findAssetByAddress('ETH');
    const renderName = showName && Boolean(name);
    const renderSymbol = showSymbol && Boolean(symbol);
    const renderAmount = showAmount && amount !== null && amount !== undefined;
    const renderSymbolOrName = renderName || renderSymbol;
    const renderRow = renderAmount || renderSymbol || renderName;
    const symbolOrName = renderName ? name : renderSymbol ? symbol : null;

    return (
      <View style={[styles.center, containerStyle]}>
        <Avatar
          rounded
          source={getImage(symbol)}
          size={50}
          containerStyle={showName || showSymbol ? styles.mb1 : null}
          overlayContainerStyle={images.fixAndroid}
          {...avatarProps}
        />
        {renderRow ? (
          <Row>
            {renderAmount ? (
              <>
                <EthereumAmount
                  amount={amount}
                  unit={unit}
                  style={[fonts.small, styles.textCenter]}
                  {...amountProps}
                />
                <Text> </Text>
              </>
            ) : null}
            {renderSymbolOrName ? (
              <Text style={[fonts.small, styles.textCenter]} {...labelProps}>
                {symbolOrName}
              </Text>
            ) : null}
          </Row>
        ) : null}
      </View>
    );
  }
}
