import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { styles } from '../../styles';
import { formatProduct } from '../../utils';
import TokenAmount from '../components/TokenAmount';
import OrderbookPrice from './OrderbookPrice';

export default class TokenAmountWithOrderbookPrice extends Component {
  static get propTypes() {
    return {
      baseSymbol: PropTypes.string.isRequired,
      quoteSymbol: PropTypes.string.isRequired,
      side: PropTypes.string.isRequired
    };
  }

  render() {
    const { baseSymbol, quoteSymbol, side, ...rest } = this.props;

    return (
      <Fragment>
        <TokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={baseSymbol}
          label={'Buying'}
          {...rest}
        />
        <TokenAmount
          label={'price'}
          amount={
            <OrderbookPrice
              product={formatProduct(baseSymbol, quoteSymbol)}
              default={0}
              side={side}
            />
          }
          format={false}
          symbol={quoteSymbol}
        />
      </Fragment>
    );
  }
}
