import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../../styles';

class TradingHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.grey1}
        statusBarProps={{ barStyle: 'light-content' }}
        centerComponent={{
          text: 'Mobidex',
          style: { color: 'white', fontSize: 18 }
        }}
        rightComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => this.props.navigation.push('CreateOrder')}
          >
            <Icon name="add" color="white" size={15} />
          </TouchableOpacity>
        }
      />
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  TradingHeader
);
