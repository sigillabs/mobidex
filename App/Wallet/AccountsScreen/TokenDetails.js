import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { gotoSendScreen, gotoReceiveScreen } from '../../../thunks';
import {
  formatAmountWithDecimals,
  summarizeAddress,
  getImage
} from '../../../utils';
import Button from '../../components/Button';

class TokenDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddress: false
    };
  }

  receive = () => {
    this.props.dispatch(gotoReceiveScreen(this.props.token));
  };

  send = () => {
    this.props.dispatch(gotoSendScreen(this.props.token));
  };

  toggleShowAddress = () => {
    this.setState({ showAddress: !this.state.showAddress });
  };

  render() {
    let { token, address } = this.props;
    let { balance, decimals } = token;

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
            source={getImage(token.symbol)}
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
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(TokenDetails);
