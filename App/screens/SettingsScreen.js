import PropTypes from 'prop-types';
import * as _ from 'lodash';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { setGasStation } from '../../actions';
import { showModal } from '../../navigation';
import { styles } from '../../styles';
import { clearCache } from '../../utils';
import MutedText from '../components/MutedText';

const GAS_STATIONS = [
  { name: 'default', label: 'default' },
  { name: 'eth-gas-station-info', label: 'ethgasstation.info' },
  { name: 'ether-chain-gas-price-oracle', label: 'etherchain.info' }
];

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
          text: 'Settings',
          alignment: 'center'
        }
      }
    };
  }

  static propTypes = {
    network: PropTypes.number.isRequired,
    relayerEndpoint: PropTypes.string.isRequired,
    forexCurrency: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
    gasStation: PropTypes.string.isRequired,
    gasLevel: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const {
      network,
      relayerEndpoint,
      forexCurrency,
      quoteSymbol,
      gasStation,
      gasLevel
    } = this.props;

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
          title={<MutedText>Gas Level</MutedText>}
          subtitle={<Text>{gasLevel}</Text>}
        />
        <ListItem
          title={<MutedText>Gas Station</MutedText>}
          subtitle={
            <TouchableOpacity onPress={this.showGasStationSelect}>
              <Text>{_.find(GAS_STATIONS, { name: gasStation }).label}</Text>
            </TouchableOpacity>
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

  clearCache = () => {
    clearCache();
  };

  showGasStationSelect = () => {
    showModal('modals.Select', {
      title: 'Select Gas Station',
      options: GAS_STATIONS,
      select: name => this.props.dispatch(setGasStation(name)),
      selected: this.props.gasStation
    });
  };
}

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
