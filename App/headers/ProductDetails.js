import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import LogoTicker from '../views/LogoTicker';
import ToggleForexButton from '../views/ToggleForexButton';
import NavigationService from '../../services/NavigationService';

class ProductDetailsHeader extends Component {
  render() {
    const { base, quote } = this.props;

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
        centerComponent={<LogoTicker base={base} quote={quote} />}
        rightComponent={
          this.props.showForexToggleButton ? <ToggleForexButton /> : null
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }
}

ProductDetailsHeader.propTypes = {
  showBackButton: PropTypes.bool,
  showForexToggleButton: PropTypes.bool,
  base: PropTypes.object.isRequired,
  quote: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(
  state => ({
    tokens: state.relayer.tokens
  }),
  dispatch => ({ dispatch })
)(ProductDetailsHeader);
