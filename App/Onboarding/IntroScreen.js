import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { setError } from '../../actions';
import { loadAssets, loadProductsAndTokens } from '../../thunks';
import { colors } from '../../styles.js';
import Button from '../components/Button';
import Padding from '../components/Padding';
import ImportPrivateKey from '../views/ImportPrivateKey';

class Intro extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: '35%',
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          width: '100%'
        }}
      >
        <Image
          source={require('../../images/logo-with-text/logo-with-text-transparent.png')}
          style={{
            marginHorizontal: 0,
            width: '100%',
            resizeMode: Image.resizeMode.contain
          }}
        />
        <Padding size={20} />
        <Text h4>Trade ERC-20 Tokens.</Text>
        <Padding size={20} />
        <Text h6>To get started, Import a wallet.</Text>
        <Padding size={20} />
        <ImportPrivateKey
          onFinish={async () => {
            try {
              await this.props.dispatch(loadProductsAndTokens());
              await this.props.dispatch(loadAssets());
              this.props.navigation.navigate({ routeName: 'List' });
            } catch (err) {
              this.props.dispatch(setError(err));
            }
          }}
        />
        {/*<Button
                  large
                  onPress={() => this.props.navigation.push('Import')}
                  title="Import"
                />*/}
      </View>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(Intro);
