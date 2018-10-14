import PropTypes from 'prop-types';
import { addressProp } from './address';
import { assetDataProp } from './asset-data';

export const assetProp = PropTypes.shape({
  address: addressProp.isRequired,
  assetData: assetDataProp.isRequired,
  decimals: PropTypes.number,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired
});
