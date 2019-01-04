import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from '../../styles';
import { clearCache } from '../../utils';
import MutedText from '../components/MutedText';

class SettingsScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: false
        },
        title: {
          text: 'Mobidex Settings',
          alignment: 'center'
        }
      }
    };
  }
  
  static propTypes = {
    network: PropTypes.number.isRequired,
    relayerEndpoint: PropTypes.string.isRequired,
    forexCurrency: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired
  };

  render() {
    const { network, relayerEndpoint, forexCurrency, quoteSymbol } = this.props;
    return (
      <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
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
    );
  }
}

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
