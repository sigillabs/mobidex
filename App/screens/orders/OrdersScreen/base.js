import ethUtil from 'ethereumjs-util';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../../../navigation';
import { fonts, styles } from '../../../../styles';
import { cancel, loadOrders } from '../../../../thunks';
import * as AssetService from '../../../../services/AssetService';
import { navigationProp } from '../../../../types/props';
import CollapsibleButtonView from '../../../components/CollapsibleButtonView';
import EmptyList from '../../../components/EmptyList';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import MutedText from '../../../components/MutedText';
import Row from '../../../components/Row';

class BaseTokenOrder extends Component {
  static get propTypes() {
    return {
      order: PropTypes.object.isRequired
    };
  }

  render() {
    const { order } = this.props;

    if (!order) return null;

    const { makerAssetData, takerAssetData } = order;
    const makerToken = AssetService.findAssetByData(makerAssetData);
    const takerToken = AssetService.findAssetByData(takerAssetData);

    if (!makerToken) return null;
    if (!takerToken) return null;

    return (
      <ListItem
        roundAvatar
        bottomDivider
        title={
          <View style={[styles.w100, styles.mh2, styles.alignCenter]}>
            <Row>
              <FormattedTokenAmount
                amount={order.makerAssetAmount}
                assetData={makerToken.assetData}
                style={[styles.textCenter, fonts.large, styles.flex1]}
                isUnitAmount={false}
              />
              <Icon name="swap" color="black" size={24} />
              <FormattedTokenAmount
                amount={order.takerAssetAmount}
                assetData={takerToken.assetData}
                style={[
                  styles.textCenter,
                  fonts.large,
                  styles.pl2,
                  styles.flex1
                ]}
                isUnitAmount={false}
              />
            </Row>
          </View>
        }
        subtitle={
          <View style={[styles.w100, styles.mh2, styles.alignCenter]}>
            <Row>
              <MutedText style={[styles.textCenter, styles.flex1]}>
                Maker
              </MutedText>
              <MutedText style={[styles.textCenter, styles.pl2, styles.flex1]}>
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

const TokenOrder = connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(BaseTokenOrder);

class BaseOrdersScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      orders: PropTypes.array.isRequired,
      address: PropTypes.string.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.onRefresh(false);
  }

  render() {
    const orders = this.filterOrders();

    return (
      <SafeAreaView style={[styles.flex1]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {orders.length > 0 ? (
            <View style={[styles.w100, styles.background]}>
              {orders.map((order, index) => {
                return (
                  <CollapsibleButtonView
                    key={index}
                    buttonTitle={'Cancel'}
                    buttonWidth={100}
                    onPress={() => this.cancelOrder(order)}
                  >
                    <TokenOrder order={order} />
                  </CollapsibleButtonView>
                );
              })}
            </View>
          ) : (
            <EmptyList style={[styles.w100, styles.h100]}>
              <MutedText style={{ marginTop: 25 }}>
                No active orders to show.
              </MutedText>
            </EmptyList>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  filterOrders = () => {
    const orders = this.props.orders.filter(
      o =>
        o.makerAddress &&
        ethUtil.stripHexPrefix(o.makerAddress).toLowerCase() ===
          ethUtil.stripHexPrefix(this.props.address).toLowerCase()
    );
    return orders;
  };

  cancelOrder = order => {
    this.props.dispatch(cancel(this.props.navigation.componentId, order));
  };

  onRefresh = async (force = true) => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadOrders(force));
    this.setState({ refreshing: false });
  };
}

export default connect(
  state => ({
    orders: state.relayer.orders,
    address: state.wallet.address
  }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseOrdersScreen));
