import { BigNumber } from '@uniswap/sdk';
import PropTypes from 'prop-types';
import { addressProp } from './address';

export const productProp = PropTypes.shape({
  address: addressProp.isRequired,
  maxAmount: PropTypes.oneOf([PropTypes.string, PropTypes.number, BigNumber])
    .isRequired,
  minAmount: PropTypes.oneOf([PropTypes.string, PropTypes.number, BigNumber])
    .isRequired,
  precision: PropTypes.number.isRequired
});
