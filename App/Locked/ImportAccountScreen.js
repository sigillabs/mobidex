import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import ImportMnemonic from '../views/ImportMnemonic';
import Tabs from './Tabs';

class ImportAccountScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
        <Tabs index={1} />
        <ImportMnemonic
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
  ImportAccountScreen
);
