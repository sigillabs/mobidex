import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button.js';
import NavigationService from '../services/NavigationService.js';
import { colors } from '../../styles';
import RelayerError from './RelayerError';

export default class ErrorScreen extends Component {
  // ${response.status} - ${response.statusText}\n${requestType} ${url}\n${text}
  renderRelayerErrors() {
    const { error } = this.props.navigation.state.params;
    const message = error.message;
    const lines = message.split('\n');
    const json = lines[lines.length - 1];
    const errorObject = JSON.parse(json);
    if (errorObject.code === 100) {
      return errorObject.validationErrors.map((ve, index) => (
        <RelayerError key={index} {...ve} style={styles.text} />
      ));
    }
    return <Text style={styles.text}>Relayer failed for some reason</Text>;
  }

  renderMessage() {
    const error = this.props.navigation.getParam('error');
    if (!error || !error.message) {
      return this.renderGeneral();
    }
    const message = error.message;

    if (message.indexOf('400') === 0) {
      const errorElements = this.renderRelayerErrors();
      return errorElements[0];
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
        <View>{this.renderMessage()}</View>
        <Button
          large
          title="Get Out Of Here"
          icon={<Icon name="refresh" color="white" />}
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
    paddingBottom: 10
  }
};
