import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageRoot from '../../components/PageRoot';
import Row from '../../components/Row';
import TokenList from './TokenList';
import PortfolioDetails from './PortfolioDetails';
import TokenDetails from './TokenDetails';

class AccountsScreen extends Component {
  static get propTypes() {
    return {
      assets: PropTypes.arrayOf(PropTypes.object).isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      asset: 'ETH'
    };
  }

  render() {
    const asset = _.find(this.props.assets, { symbol: this.state.asset });
    const ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    const assets = [ethToken].concat(
      _.filter(
        this.props.assets,
        asset => asset.symbol !== 'WETH' && asset.symbol !== 'ETH'
      )
    );

    return (
      <PageRoot>
        <Row>
          {asset ? (
            <TokenDetails asset={asset} />
          ) : (
            <PortfolioDetails assets={this.props.assets} />
          )}
        </Row>
        <Row>
          <TokenList
            asset={asset}
            assets={assets}
            onPress={asset => {
              if (this.state.asset !== asset.symbol) {
                this.setState({
                  asset: asset.symbol
                });
              }
            }}
          />
        </Row>
      </PageRoot>
    );
  }
}

export default connect(state => ({
  assets: state.relayer.assets
}))(AccountsScreen);
