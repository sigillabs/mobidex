import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { closeDrawer } from '../../actions';
import { forget, gotoOnboardingOrLocked } from '../../thunks';
import Button from '../components/Button';

class Actions extends Component {
  render() {
    return (
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Button
          large
          title="History"
          icon={<Icon name="move-to-inbox" color="white" size={18} />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.history}
        />
        <View style={{ width: 10 }} />
        <Button
          large
          title="Orders"
          icon={<Icon name="move-to-inbox" color="white" size={18} />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.orders}
        />
        <View style={{ width: 10 }} />
        <Button
          large
          title="Lock"
          icon={<Icon name="move-to-inbox" color="white" size={18} />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.lock}
        />
      </View>
    );
  }

  history = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'History'
      })
    );
  };

  orders = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'Orders'
      })
    );
  };

  lock = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(forget());
    this.props.dispatch(gotoOnboardingOrLocked());
  };
}

export default connect(
  state => ({
    navigation: state.navigation
  }),
  dispatch => ({ dispatch })
)(Actions);
