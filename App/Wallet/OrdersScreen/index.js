import ethUtil from 'ethereumjs-util';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { colors } from '../../../styles';
import { loadOrders, cancelOrder } from '../../../thunks';
import { formatAmountWithDecimals, getTokenByAddress } from '../../../utils';
import EmptyList from '../../components/EmptyList';
import MutedText from '../../components/MutedText';
import Row from '../../components/Row';
import NavigationService from '../../services/NavigationService';
import Tabs from '../Tabs';
import Cancelling from './Cancelling';
import Cancelled from './Cancelled';

const TokenOrder = connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(
  class BaseTokenOrder extends Component {
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
        getTokenByAddress(this.props.web3, this.props.order.makerTokenAddress),
        getTokenByAddress(this.props.web3, this.props.order.takerTokenAddress)
      ]);

      this.setState({
        makerToken,
        takerToken,
        ready: true
      });
    }

    render() {
      if (!this.state.ready) return null;

      const { makerToken, takerToken } = this.state;
      const { order } = this.props;
      const left = formatAmountWithDecimals(
        order.makerTokenAmount,
        makerToken.decimals || 18
      );
      const right = formatAmountWithDecimals(
        order.takerTokenAmount,
        takerToken.decimals || 18
      );

      return (
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <View style={styles.itemContainer}>
              <Row>
                <Text style={([styles.left, styles.large], { flex: 1 })}>
                  {left} {makerToken.symbol}
                </Text>
                <Icon name="swap" color="black" size={24} />
                <Text
                  style={[
                    styles.right,
                    styles.large,
                    styles.padLeft,
                    { flex: 1 }
                  ]}
                >
                  {right} {takerToken.symbol}
                </Text>
              </Row>
            </View>
          }
          subtitle={
            <View style={styles.itemContainer}>
              <Row>
                <MutedText style={[styles.left]}>Maker</MutedText>
                <MutedText style={[styles.right, styles.padLeft]}>
                  Taker
                </MutedText>
              </Row>
            </View>
          }
          hideChevron={true}
        />
      );
    }
  }
);

class OrdersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      showForexPrices: false,
      showCancelling: false,
      showCancelled: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    if (this.state.showCancelled)
      return (
        <Cancelled
          onLeave={this.setState({
            showCancelled: false,
            showCancelling: false
          })}
        />
      );
    if (this.state.showCancelling) return <Cancelling />;

    const orders = this.filterOrders();

    return (
      <View>
        <Tabs index={1} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh}
            />
          }
        >
          {orders.length > 0 ? (
            <View style={{ width: '100%', backgroundColor: 'white' }}>
              {orders.map((order, index) => {
                return (
                  <Swipeout
                    key={index}
                    autoClose={true}
                    style={{
                      backgroundColor: 'transparent'
                    }}
                    right={[
                      {
                        backgroundColor: colors.yellow0,
                        text: 'Cancel',
                        type: 'delete',
                        underlayColor: colors.yellow0,
                        onPress: () => this.cancelOrder(order)
                      }
                    ]}
                  >
                    <TokenOrder order={order} />
                  </Swipeout>
                );
              })}
            </View>
          ) : (
            <EmptyList style={{ height: '100%', width: '100%' }}>
              <MutedText style={{ marginTop: 25 }}>
                No active orders to show.
              </MutedText>
            </EmptyList>
          )}
        </ScrollView>
      </View>
    );
  }

  filterOrders() {
    const { params } = this.props.navigation.state;
    let orders = this.props.orders
      .filter(
        o =>
          ethUtil.stripHexPrefix(o.maker) ===
          ethUtil.stripHexPrefix(this.props.address)
      )
      .filter(o => o.status === 0);
    if (params && params.token) {
      orders = orders.filter(
        o => o.maker_token_address === this.props.navigation.state.params.token
      );
    }
    return orders;
  }

  async cancelOrder(order) {
    this.setState({ showCancelling: true });
    try {
      await this.props.dispatch(cancelOrder(order));
    } catch (error) {
      NavigationService.error(error);
      return;
    } finally {
      this.setState({ showCancelling: false });
    }
    this.setState({ showCancelled: true });
    this.onRefresh();
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadOrders());
    this.setState({ refreshing: false });
  }
}

const styles = {
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: '100%'
  },
  center: {
    textAlign: 'center'
  },
  padBottom: {
    marginBottom: 5
  },
  padLeft: {
    marginLeft: 10
  },
  small: {
    fontSize: 10
  },
  large: {
    fontSize: 14
  },
  right: {
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10
  }
};

export default connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(OrdersScreen);
