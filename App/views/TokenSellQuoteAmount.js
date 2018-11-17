import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { styles } from '../../styles';
import TokenAmount from '../components/TokenAmount';
import BestCasePrice from './BestCasePrice';

class TokenSellQuoteAmount extends Component {
  static get propTypes() {
    return {
      quote: PropTypes.object,
      baseSymbol: PropTypes.string.isRequired,
      quoteSymbol: PropTypes.string.isRequired
    };
  }

  render() {
    const { quote, baseSymbol, quoteSymbol } = this.props;

    return (
      <Fragment>
        <TokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={baseSymbol}
          label={'Selling'}
          {...this.props}
        />
        <BestCasePrice
          style={[styles.flex1, styles.mv2, styles.mr2, styles.p2, styles.mt4]}
          quote={quote}
          symbol={quoteSymbol}
        />
      </Fragment>
    );
  }
}

export default connect(({ quote: { sell: { quote } } }) => ({ quote }))(
  TokenSellQuoteAmount
);
