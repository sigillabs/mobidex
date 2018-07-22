import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Clipboard, Share, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import ethUtil from 'ethereumjs-util';
import Button from '../components/Button';
import Row from '../components/Row';

class ReceiveScreen extends Component {
  render() {
    let uri = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ethUtil.stripHexPrefix(
      this.props.address
    )}`;

    return (
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]}
      >
        <Avatar size="xlarge" source={{ uri }} />
        <Text h4>Address</Text>
        <Text style={{ fontSize: 13 }}>{this.props.address}</Text>
        <Row>
          <Button
            large
            icon={<MaterialIcons name="send" size={20} color="white" />}
            onPress={() => this.share()}
            title="Share Address"
            style={{ marginTop: 10 }}
          />
          <Button
            large
            icon={<MaterialIcons name="content-copy" size={20} color="white" />}
            onPress={() => this.copy()}
            title="Copy Address"
            style={{ marginTop: 10 }}
          />
        </Row>
      </View>
    );
  }

  copy() {
    Clipboard.setString(this.props.address.toString());
  }

  share() {
    Share.share(
      {
        message: `Here's My Address: ${this.props.address}`,
        title: 'My Address'
      },
      {
        // Android only:
        dialogTitle: 'Mobidex Address',
        // iOS only:
        subject: 'Mobidex Address',
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter']
      }
    );
  }
}

ReceiveScreen.propTypes = {
  address: PropTypes.string
};

export default connect(
  state => ({ ...state.device.layout, ...state.wallet }),
  dispatch => ({ dispatch })
)(ReceiveScreen);
