import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { push } from '../../navigation';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';

export default class NormalHeader extends Component {
  static get propTypes() {
    return {
      showBackButton: PropTypes.bool,
      title: PropTypes.string
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
          text: this.props.title || 'Mobidex',
          style: { color: 'black', fontSize: 18 }
        }}
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}
