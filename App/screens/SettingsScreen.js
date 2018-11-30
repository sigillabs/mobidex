import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { clearCache } from '../../utils';
import MutedText from '../components/MutedText';

class SettingsScreen extends Component {
  static propTypes = {
    network: PropTypes.number.isRequired,
    relayerEndpoint: PropTypes.string.isRequired,
    forexCurrency: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired
  };

  render() {
    const { network, relayerEndpoint, forexCurrency, quoteSymbol } = this.props;
    return (
      <View style={{ width: '100%' }}>
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
          <ListItem
            title={<MutedText>Version</MutedText>}
            subtitle={
              <Text>
                {DeviceInfo.getSystemName()} {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()}
              </Text>
            }
          />
          <ListItem
            title={<MutedText>Clear Cache</MutedText>}
            subtitle={
              <TouchableOpacity onPress={() => clearCache()}>
                <Text>Click Here</Text>
              </TouchableOpacity>
            }
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
