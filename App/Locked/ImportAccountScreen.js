import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import ImportMnemonicWizard from '../views/ImportMnemonicWizard';
import Tabs from './Tabs';

class ImportAccountScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: null,
      password: null,
      page: 0
    };
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
        <Tabs index={1} />
        <ImportMnemonicWizard
          onSubmit={() => this.onSubmit()}
          style={{ paddingTop: 50 }}
        />
      </View>
    );
  }

  async onSubmit() {
    try {
      await this.props.dispatch(loadProductsAndTokens());
      await this.props.dispatch(loadAssets());
      this.props.navigation.navigate({ routeName: 'List' });
    } catch (err) {
      this.props.dispatch(setError(err));
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  ImportAccountScreen
);
