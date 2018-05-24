import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { toggleDrawer } from '../../actions';
import { colors } from '../../styles';

class ProductsHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.grey1}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => this.props.dispatch(toggleDrawer())}
          >
            <Icon name="list" color="white" size={15} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Mobidex',
          style: { color: 'white', fontSize: 18 }
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
            <Icon name="attach-money" color="white" size={15} />
          </TouchableOpacity>
        }
        outerContainerStyles={{ height: 80 }}
      />
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  ProductsHeader
);
