import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import { pop, push } from '../../navigation';

export default class OrdersHeader extends Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      showBackButton: PropTypes.bool
    };
  }

  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          this.props.showBackButton ? (
            <TouchableOpacity style={{ padding: 10 }} onPress={() => pop()}>
              <Icon name="arrow-back" color="black" size={15} />
            </TouchableOpacity>
          ) : (
            <FakeHeaderButton />
          )
        }
        centerComponent={{
          text: this.props.title,
          style: { color: 'black', fontSize: 18 }
        }}
        rightComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => push('navigation.tradeHistory')}
          >
            <Icon name="history" color="black" size={15} />
          </TouchableOpacity>
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}
