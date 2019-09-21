import PropTypes from 'prop-types';
import {addressProp} from './address';

export const tokenProp = PropTypes.shape({
  address: addressProp,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
});
