import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import Unlock from '../views/Unlock';
import BigCenter from '../components/BigCenter';
import Tabs from './Tabs';

class UnlockScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 40 }}>
        <Tabs index={0} />
        <BigCenter>
          <Unlock
            onFinish={async () => {
              try {
                await this.props.dispatch(loadProductsAndTokens(true));
                await this.props.dispatch(loadAssets());
                this.props.navigation.navigate({ routeName: 'Main' });
              } catch (err) {
                this.props.dispatch(setError(err));
              }
            }}
          />
        </BigCenter>
      </View>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(UnlockScreen);
