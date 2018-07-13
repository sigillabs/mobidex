import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DeviceInfo, ScrollView, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Button from './components/Button';
import MutedText from './components/MutedText';
import NormalHeader from './headers/Normal';

class SettingsScreen extends Component {
  render() {
    const { network, relayerEndpoint, forexCurrency, quoteSymbol } = this.props;
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <NormalHeader
          navigation={this.props.navigation}
          title="Settings"
          showBackButton={false}
          showForexToggleButton={false}
        />
        <ScrollView>
          <ListItem
            title={<MutedText>Forex Currency</MutedText>}
            subtitle={<Text>{forexCurrency}</Text>}
          />
          <ListItem
            title={<MutedText>Quote Token</MutedText>}
            subtitle={<Text>{quoteSymbol}</Text>}
          />
          <ListItem
            title={<MutedText>Network</MutedText>}
            subtitle={<Text>{network}</Text>}
          />
          <ListItem
            title={<MutedText>Relayer Endpoint</MutedText>}
            subtitle={<Text>{relayerEndpoint}</Text>}
          />
        </ScrollView>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  network: PropTypes.string.isRequired,
  relayerEndpoint: PropTypes.string.isRequired,
  forexCurrency: PropTypes.string.isRequired,
  quoteSymbol: PropTypes.string.isRequired
};

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
