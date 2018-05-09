import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { loadTokens } from '../../thunks';
import Row from '../components/Row';
import Actions from './Actions';
import TokenList from './TokenList';
import TokenDetails from './TokenDetails';

class DrawerController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
    };
  }

  render() {
    if (!this.props.web3) {
      return <View />;
    }

    if (!this.props.assets.length) {
      return <View />;
    }

    let ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    let filteredTokens = _.without(this.props.assets, ethToken);
    filteredTokens = _.without(this.props.assets, { symbol: 'WETH' });

    return (
      <View style={{ height: '100%', paddingTop: 25, borderRightWidth: 1 }}>
        <Row style={{ height: 200 }}>
          <TokenDetails token={this.state.token || ethToken} />
        </Row>
        <Row>
          <TokenList
            token={this.state.token}
            tokens={filteredTokens}
            onPress={token => this.setState({ token })}
          />
        </Row>
        <Row>
          <Actions />
        </Row>
      </View>
    );
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(DrawerController);
