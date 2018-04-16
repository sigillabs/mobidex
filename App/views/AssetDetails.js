import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Button from '../components/Button';
import {
  formatAmountWithDecimals,
  summarizeAddress,
  getImage
} from '../../utils';

class AssetDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddress: false
    };
  }

  receive = () => {
    this.props.dispatch(NavigationActions.push({ routeName: 'Receive' }));
  };

  send = () => {
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'Send',
        params: {
          token: this.props.asset
        }
      })
    );
  };

  wrap = () => {
    this.props.dispatch(NavigationActions.push({ routeName: 'Wrap' }));
  };

  unwrap = () => {
    this.props.dispatch(NavigationActions.push({ routeName: 'Unwrap' }));
  };

  toggleShowAddress = () => {
    this.setState({ showAddress: !this.state.showAddress });
  };

  render() {
    let { asset, address } = this.props;
    let { balance, decimals } = asset;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'stretch'
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Avatar
            large
            rounded
            width={34}
            height={34}
            source={getImage(asset.symbol)}
            activeOpacity={0.7}
            onPress={this.toggleShowAddress}
          />
          <Text style={{ marginTop: 10, marginBottom: 10 }}>
            {formatAmountWithDecimals(balance, decimals)}
          </Text>
          <Text onPress={this.toggleShowAddress}>
            {this.state.showAddress ? address : summarizeAddress(address)}
          </Text>
        </View>

        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button
            large
            title="Receive"
            icon={<Icon name="move-to-inbox" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.receive}
          />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Send"
            icon={<Icon name="send" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.send}
          />
          {asset !== null &&
          (asset.symbol === 'ETH' || asset.symbol === 'WETH') ? (
            <View style={{ width: 10 }} />
          ) : null}
          {asset.symbol === 'ETH' ? (
            <Button
              large
              title="Wrap"
              icon={<Icon name="move-to-inbox" color="white" size={18} />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.wrap}
            />
          ) : null}
          {asset !== null && asset.symbol === 'WETH' ? (
            <Button
              large
              title="Unwrap"
              icon={<Icon name="move-to-inbox" color="white" size={18} />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.unwrap}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(AssetDetails);
