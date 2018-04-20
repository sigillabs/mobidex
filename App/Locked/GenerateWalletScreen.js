import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import GenerateWallet from '../views/GenerateWallet';
import ButtonGroup from '../components/ButtonGroup';
import BigCenter from '../components/BigCenter';

class GenerateWalletScreen extends Component {
  render() {
    return (
      <BigCenter>
        <GenerateWallet
          onFinish={async () => {
            try {
              await this.props.dispatch(loadProductsAndTokens());
              await this.props.dispatch(loadAssets());
              this.props.navigation.navigate({ routeName: 'Main' });
            } catch (err) {
              setError(err);
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
          selectedIndex={2}
          buttons={['Unlock', 'Import', 'New']}
        />
      </BigCenter>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  GenerateWalletScreen
);
