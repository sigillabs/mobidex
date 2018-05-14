import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import Unlock from '../views/Unlock';
import ButtonGroup from '../components/ButtonGroup';
import BigCenter from '../components/BigCenter';

class UnlockScreen extends Component {
  render() {
    return (
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
        <ButtonGroup
          onPress={index => {
            switch (index) {
              case 0:
                this.props.navigation.navigate({ routeName: 'Unlock' });
                break;

              case 1:
                this.props.navigation.navigate({
                  routeName: 'ImportPrivateKey'
                });
                break;

              case 2:
                this.props.navigation.navigate({ routeName: 'GenerateWallet' });
                break;
            }
          }}
          selectedIndex={0}
          buttons={['Unlock', 'Import', 'New']}
        />
      </BigCenter>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(UnlockScreen);
