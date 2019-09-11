import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as AssetService from '../../services/AssetService';
import { fonts } from '../../styles';
import { addressProp } from '../../types/props';
import HorizontalPadding from '../components/HorizontalPadding';
import Row from '../components/Row';
import TokenIcon from '../components/TokenIcon';

export default class LogoBalance extends Component {
  static get propTypes() {
    return {
      token: addressProp.isRequired,
      avatarProps: PropTypes.shape({
        small: PropTypes.bool,
        medium: PropTypes.bool,
        large: PropTypes.bool,
        xlarge: PropTypes.bool
      })
    };
  }

  static get defaultProps() {
    return {
      avatarProps: {
        medium: true,
        rounded: true,
        activeOpacity: 0.7,
        overlayContainerStyle: { backgroundColor: 'transparent' }
      }
    };
  }

  render() {
    const { avatarProps, token } = this.props;

    return (
      <Row style={[style.container]}>
        <TokenIcon
          address={token}
          showName={false}
          showSymbol={false}
          {...avatarProps}
        />
        <HorizontalPadding size={10} />
      </Row>
    );
  }
}

const style = {
  container: {
    backgroundColor: 'transparent',
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
