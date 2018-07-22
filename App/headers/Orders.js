import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import NavigationService from '../services/NavigationService';

export default class OrdersHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          this.props.showBackButton ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => NavigationService.goBack()}
            >
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
            onPress={() => NavigationService.navigate('History')}
          >
            <Icon name="history" color="black" size={15} />
          </TouchableOpacity>
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}

OrdersHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool
};
