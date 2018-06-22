import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gotoUnlockScreen, gotoImportAccountScreen } from '../../thunks';
import TabsComponent from '../components/Tabs';

class LockedTabs extends Component {
  render() {
    return (
      <TabsComponent
        onPress={selectedIndex => this.updateIndex(selectedIndex)}
        selectedIndex={this.props.index}
        buttons={['Unlock', 'Import']}
      />
    );
  }

  updateIndex(index) {
    switch (index) {
      default:
      case 0:
        this.props.dispatch(gotoUnlockScreen());
        break;
      case 1:
        this.props.dispatch(gotoImportAccountScreen());
        break;
    }
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(LockedTabs);
