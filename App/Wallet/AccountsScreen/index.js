import * as _ from 'lodash';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import {
  loadTokens,
  updateForexTickers,
  updateTokenTickers
} from '../../../thunks';
import Row from '../../components/Row';
import Tabs from '../Tabs';
import TokenList from './TokenList';
import TokenDetails from './TokenDetails';

class AccountsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      token: null
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    if (!this.props.web3) {
      return <View />;
    }

    if (!this.props.assets.length) {
      return <View />;
    }

    let ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    let filteredTokens = _.filter(
      this.props.assets,
      asset => asset.symbol !== 'ETH' && asset.symbol !== 'WETH'
    );

    return (
      <View>
        <Tabs index={0} />
        <ScrollView
          style={{ width: '100%' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          <Row>
            <TokenDetails token={this.state.token || ethToken} />
          </Row>
          <Row>
            <TokenList
              token={this.state.token}
              tokens={filteredTokens}
              onPress={token =>
                this.state.token !== token
                  ? this.setState({ token })
                  : this.setState({ token: null })
              }
            />
          </Row>
        </ScrollView>
      </View>
    );
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAssets());
    await this.props.dispatch(updateForexTickers());
    await this.props.dispatch(updateTokenTickers());
    this.setState({ refreshing: false });
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(AccountsScreen);
