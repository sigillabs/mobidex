import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { closeDrawer } from '../../actions';
import Button from '../components/Button';

class Actions extends Component {
  history = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'History'
      })
    );
  };

  processing = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'Processing'
      })
    );
  };

  render() {
    return (
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
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
          title="Transactions"
          icon={<Icon name="send" color="white" size={18} />}
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.processing}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    navigation: state.navigation
  }),
  dispatch => ({ dispatch })
)(Actions);
