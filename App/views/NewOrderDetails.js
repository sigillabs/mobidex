import * as _ from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  calculatePrice,
  calculateAmount,
  formatAmount,
  formatAmountWithDecimals
} from '../../utils';
import { fillOrder, cancelOrder } from '../../thunks';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Row from '../components/Row';
import MutedText from '../components/MutedText';

class NewOrderDetails extends Component {
  fillOrder = async () => {
    this.props.dispatch(fillOrder(this.props.order));
  };

  cancelOrder = async () => {
    this.props.dispatch(cancelOrder(this.props.order));
  };

  render() {
    const { address, quoteToken, baseToken, order } = this.props;
    const isBuy = quoteToken.address === order.makerTokenAddress;
    const isMine = address === order.maker;
    const [myToken, theirToken] = isBuy
      ? [baseToken, quoteToken]
      : [quoteToken, baseToken];
    const [myAmount, theirAmount] =
      myToken.address === order.makerTokenAddress
        ? [order.makerTokenAmount, order.takerTokenAmount]
        : [order.takerTokenAmount, order.makerTokenAmount];
    const price = calculatePrice(order, quoteToken, baseToken);
    const amount = calculateAmount(order, quoteToken, baseToken);

    return (
      <View>
        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Logo
            symbol={myToken.symbol}
            subtitle={`-${formatAmountWithDecimals(
              myAmount,
              myToken.decimals
            )} ${myToken.symbol}`}
          />
          <View style={{ height: 50, marginLeft: 10, marginRight: 10 }}>
            <EntypoIcon
              name="arrow-long-right"
              size={40}
              style={{ marginTop: -10, marginBottom: -10 }}
            />
            <EntypoIcon
              name="arrow-long-left"
              size={40}
              style={{ marginTop: -10, marginBottom: -10 }}
            />
          </View>
          <Logo
            symbol={theirToken.symbol}
            subtitle={`+${formatAmountWithDecimals(
              theirAmount,
              theirToken.decimals
            )} ${theirToken.symbol}`}
          />
        </Row>
        <Card>
          <View>
            <Text>
              {formatAmount(!isNaN(price) ? price : 0)} {quoteToken.symbol}{' '}
              {'/'} {baseToken.symbol}
            </Text>
            <MutedText>Price</MutedText>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>
              {formatAmount(amount)} {baseToken.symbol}
            </Text>
            <MutedText>Amount</MutedText>
          </View>
        </Card>
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          {!isMine ? (
            <Button
              large
              icon={<MaterialIcon name="send" size={24} color="white" />}
              onPress={this.fillOrder}
              title="Fill Order"
              style={{ marginTop: 10, width: '100%' }}
            />
          ) : (
            <Button
              large
              icon={<MaterialIcon name="cancel" size={24} color="white" />}
              onPress={this.cancelOrder}
              title="Cancel Order"
              style={{ marginTop: 10, width: '100%' }}
            />
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    ...state.device,
    ...state.settings,
    ...state.wallet,
    ...state.relayer
  }),
  dispatch => ({ dispatch })
)(NewOrderDetails);
