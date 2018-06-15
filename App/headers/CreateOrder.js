import * as _ from 'lodash';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';

class CreateOrderHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => this.props.navigation.goBack(null)}
          >
            <Icon name="arrow-back" color="black" size={15} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: this.renderTitle(),
          style: { color: 'black', fontSize: 18 }
        }}
        outerContainerStyles={{ height: 80 }}
      />
    );
  }

  renderTitle() {
    const prefix = this.props.side === 'buy' ? 'Buy' : 'Sell';
    return `${prefix} ${this.props.token.name}`;
  }
}

export default connect(
  state => ({
    tokens: state.relayer.tokens,
    settings: state.settings
  }),
  dispatch => ({ dispatch })
)(CreateOrderHeader);
