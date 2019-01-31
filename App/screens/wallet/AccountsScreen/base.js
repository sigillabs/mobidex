import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { styles } from '../../../../styles';
import TokenList from './TokenList';
import PortfolioDetails from './PortfolioDetails';
import TokenDetails from './TokenDetails';

class BaseAccountsScreen extends Component {
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
    // const ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    // const assets = [ethToken].concat(
    //   _.filter(
    //     this.props.assets,
    //     asset => asset.symbol !== 'WETH' && asset.symbol !== 'ETH'
    //   )
    // );

    return (
      <SafeAreaView style={styles.flex1}>
        {asset ? (
          <TokenDetails asset={asset} />
        ) : (
          <PortfolioDetails assets={this.props.assets} />
        )}
        <TokenList
          asset={asset}
          assets={this.props.assets}
          onPress={asset => {
            if (this.state.asset !== asset.symbol) {
              this.setState({
                asset: asset.symbol
              });
            }
          }}
        />
      </SafeAreaView>
    );
  }
}

export default connect(state => ({
  assets: state.relayer.assets
}))(BaseAccountsScreen);
