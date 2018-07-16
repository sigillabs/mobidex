import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { gotoSendScreen, gotoReceiveScreen } from '../../../thunks';
import { formatAmountWithDecimals, getImage } from '../../../utils';
import Button from '../../components/Button';

class TokenDetails extends Component {
  receive() {
    this.props.dispatch(gotoReceiveScreen(this.props.token));
  }

  send() {
    this.props.dispatch(gotoSendScreen(this.props.token));
  }

  render() {
    let { token } = this.props;
    let { balance, decimals, symbol } = token;

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Avatar
          size="large"
          rounded
          source={getImage(token.symbol)}
          activeOpacity={0.7}
        />
        <Text style={{ marginTop: 5 }}>
          {formatAmountWithDecimals(balance, decimals)} {symbol}
        </Text>

        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Button
            large
            title="Receive"
            icon={
              <MaterialCommunityIcons name="qrcode" color="white" size={18} />
            }
            onPress={() => this.receive()}
          />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Send"
            icon={<MaterialIcons name="send" color="white" size={18} />}
            iconRight={true}
            onPress={() => this.send()}
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
