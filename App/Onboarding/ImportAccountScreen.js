import React, { Component } from 'react';
import ImportMnemonicWizard from '../views/ImportMnemonicWizard';
import NavigationService from '../../services/NavigationService';

export default class ImportAccountScreen extends Component {
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
        onSubmit={() => NavigationService.navigate('Products')}
        style={{ paddingTop: 50 }}
      />
    );
  }
}
