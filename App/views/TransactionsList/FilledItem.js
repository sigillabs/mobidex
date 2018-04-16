import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { gotoEtherScan } from '../../../thunks';
import {
  formatAmountWithDecimals,
  getTokenByAddress,
  formatTimestamp
} from '../../../utils';
import Row from '../../components/Row';
import MutedText from '../../components/MutedText';

class FilledItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      makerToken: null,
      takerToken: null,
      ready: false
    };
  }

  async componentDidMount() {
    let [makerToken, takerToken] = await Promise.all([
      getTokenByAddress(this.props.web3, this.props.transaction.makerToken),
      getTokenByAddress(this.props.web3, this.props.transaction.takerToken)
    ]);

    this.setState({
      makerToken,
      takerToken,
      ready: true
    });
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    let {
      id,
      filledMakerTokenAmount,
      filledTakerTokenAmount,
      timestamp
    } = this.props.transaction;
    let { makerToken, takerToken } = this.state;

    if (!makerToken)
      makerToken = {
        decimals: 18,
        symbol: '?'
      };

    if (!takerToken)
      takerToken = {
        decimals: 18,
        symbol: '?'
      };

    return (
      <TouchableOpacity onPress={() => this.props.dispatch(gotoEtherScan(id))}>
        <View>
          <Row>
            <Text>
              {formatAmountWithDecimals(
                filledMakerTokenAmount,
                makerToken.decimals
              )}{' '}
              {makerToken.symbol}
            </Text>
            <Text> for </Text>
            <Text>
              {formatAmountWithDecimals(
                filledTakerTokenAmount,
                takerToken.decimals
              )}{' '}
              {takerToken.symbol}
            </Text>
          </Row>
          <MutedText>{formatTimestamp(timestamp)}</MutedText>
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(FilledItem);
