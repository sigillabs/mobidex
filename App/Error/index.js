import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from '../components/Button.js';
import NavigationService from '../services/NavigationService.js';
import { colors } from '../../styles';
import RelayerError from './RelayerError';
import ZeroExError from './ZeroExError';

export default class ErrorScreen extends Component {
  renderRelayerErrors() {
    const error = this.props.navigation.getParam('error');
    return <RelayerError error={error} />;
  }

  renderZeroEx() {
    const error = this.props.navigation.getParam('error');
    return <ZeroExError error={error} />;
  }

  renderMessage() {
    const error = this.props.navigation.getParam('error');
    if (!error || !error.message) {
      return this.renderGeneral();
    }
    const message = error.message;

    if (RelayerError.test(error)) {
      return this.renderRelayerErrors();
    } else if (ZeroExError.test(error)) {
      return this.renderZeroEx();
    } else {
      return <Text style={styles.text}>{message}</Text>;
    }
  }

  renderGeneral() {
    return <Text style={styles.text}>Something went wrong :-/.</Text>;
  }

  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <Entypo name="emoji-sad" size={100} style={{ marginBottom: 25 }} />
        <View>{this.renderMessage()}</View>
        <Button
          large
          title="Get Out Of Here"
          icon={<Entypo name="arrow-with-circle-left" color="white" />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={() => NavigationService.navigate('List')}
        />
      </View>
    );
  }
}

ErrorScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = {
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 10,
    textAlign: 'center'
  }
};
