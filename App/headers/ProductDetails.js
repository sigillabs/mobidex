import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../actions';
import { colors } from '../../styles';
import LogoTicker from '../views/LogoTicker';
import NavigationService from '../services/NavigationService';

class ProductDetailsHeader extends Component {
  render() {
    const { token } = this.props;

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
          ) : null
        }
        centerComponent={<LogoTicker token={token} />}
        rightComponent={
          this.props.showForexToggleButton ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => this.props.dispatch(toggleShowForex())}
            >
              <Icon name="attach-money" color="black" size={15} />
            </TouchableOpacity>
          ) : null
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}

ProductDetailsHeader.propTypes = {
  showBackButton: PropTypes.bool,
  showForexToggleButton: PropTypes.bool,
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(
  state => ({
    tokens: state.relayer.tokens,
    settings: state.settings
  }),
  dispatch => ({ dispatch })
)(ProductDetailsHeader);
