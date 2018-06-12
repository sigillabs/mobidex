import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native';

export default class QRCodeScan extends Component {
  onSuccess(e) {
    this.props.onSuccess(e.data);
  }

  render() {
    try {
      const QRCodeScanner = require('react-native-qrcode-scanner');
      return (
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          topContent={
            <Text>Scan your private key in the form of a QR code</Text>
          }
        />
      );
    } catch (err) {
      console.warn('Could not import react-native-qrcode-scanner');
      return null;
    }
  }
}

QRCodeScan.propTypes = {
  onSuccess: PropTypes.func.isRequired
};
