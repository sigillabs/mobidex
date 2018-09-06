import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import { addressProp } from './address';

export const tokenProp = PropTypes.shape({
  address: addressProp.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
  allowance: PropTypes.instanceOf(BigNumber),
  balance: PropTypes.instanceOf(BigNumber)
});
