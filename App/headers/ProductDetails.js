import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as AssetService from '../../services/AssetService';
import NavigationService from '../../services/NavigationService';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import LogoTicker from '../views/LogoTicker';
import ToggleForexButton from '../views/ToggleForexButton';

class ProductDetailsHeader extends Component {
  static get propTypes() {
    return {
      showBackButton: PropTypes.bool,
      showForexToggleButton: PropTypes.bool,
      baseAssetData: PropTypes.string.isRequired,
      quoteAssetData: PropTypes.string.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }
  render() {
    const { baseAssetData, quoteAssetData } = this.props;
    const base = AssetService.findAssetByData(baseAssetData);
    const quote = AssetService.findAssetByData(quoteAssetData);

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
        centerComponent={base ? <LogoTicker base={base} quote={quote} /> : null}
        rightComponent={
          this.props.showForexToggleButton ? <ToggleForexButton /> : null
        }
      />
    );
  }
}

export default connect(
  state => ({
    tokens: state.relayer.tokens
  }),
  dispatch => ({ dispatch })
)(ProductDetailsHeader);
