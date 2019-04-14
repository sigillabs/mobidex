import PropTypes from 'prop-types';
import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { checkInternetConnection } from 'react-native-offline';
import { connect } from 'react-redux';
import { connect as setTabsRoot } from '../../navigation';
import { styles } from '../../styles';

class OfflineScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true,
        backButton: {
          visible: false
        },
        title: {
          text: 'Offline',
          alignment: 'center'
        }
      }
    };
  }

  static propTypes = {
    mobidexEndpoint: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    return (
      <SafeAreaView style={[styles.h100, styles.w100]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <Text>Offline</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      const success = await checkInternetConnection({
        url: `${this.props.mobidexEndpoint}/ping`
      });

      if (success) {
        setTabsRoot();
      }
    } finally {
      this.setState({ refreshing: false });
    }
  };
}

export default connect(
  state => ({ mobidexEndpoint: state.settings.mobidexEndpoint }),
  dispatch => ({ dispatch })
)(OfflineScreen);
