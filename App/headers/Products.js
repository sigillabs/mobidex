import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';

export default class ProductsHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        centerComponent={{
          text: 'Mobidex',
          style: { color: 'black', fontSize: 18 }
        }}
        rightComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() =>
              this.props.navigation.setParams({
                showForexPrices: !this.props.navigation.getParam(
                  'showForexPrices'
                )
              })
            }
          >
            <Icon name="attach-money" color="black" size={15} />
          </TouchableOpacity>
        }
        outerContainerStyles={{ height: 80 }}
      />
    );
  }
}

