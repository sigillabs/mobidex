import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import ImportMnemonicWizard from '../views/ImportMnemonicWizard';
import NavigationService from '../services/NavigationService';

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
      <ImportMnemonicWizard
        onSubmit={() => this.onSubmit()}
        style={{ paddingTop: 50 }}
      />
    );
  }

  async onSubmit() {
    try {
      await this.props.dispatch(loadProductsAndTokens());
      await this.props.dispatch(loadAssets());
      NavigationService.navigate('List');
    } catch (err) {
      this.props.dispatch(setError(err));
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  ImportAccountScreen
);
