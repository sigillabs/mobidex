import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  gotoHistoryScreen,
  gotoMyOrdersScreen,
  gotoAccountsScreen
} from '../../thunks';
import TabsComponent from '../components/Tabs';

class AccountsScreen extends Component {
  render() {
    return (
      <TabsComponent
        onPress={selectedIndex => this.updateIndex(selectedIndex)}
        selectedIndex={this.props.index}
        buttons={['Accounts', 'Orders', 'History']}
      />
    );
  }

  updateIndex(index) {
    switch (index) {
      default:
      case 0:
        this.props.dispatch(gotoAccountsScreen());
        break;
      case 1:
        this.props.dispatch(gotoMyOrdersScreen());
        break;
      case 2:
        this.props.dispatch(gotoHistoryScreen());
        break;
    }
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(AccountsScreen);
