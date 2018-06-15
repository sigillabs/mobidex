import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import ImportPrivateKey from '../views/ImportPrivateKey';
import BigCenter from '../components/BigCenter';
import Tabs from './Tabs';

class ImportPrivateKeyScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
        <Tabs index={1} />
        <ImportPrivateKey
          onFinish={async () => {
            try {
              await this.props.dispatch(loadProductsAndTokens());
              await this.props.dispatch(loadAssets());
              this.props.navigation.navigate({ routeName: 'List' });
            } catch (err) {
              this.props.dispatch(setError(err));
            }
          }}
          style={{ paddingTop: 50 }}
        />
      </View>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  ImportPrivateKeyScreen
);
