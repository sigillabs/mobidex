import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';

const addressValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (typeof propValue !== 'string') {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }

  if (!/^(0x)?[a-fA-F0-9]{40}$/.test(propValue)) {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }
};

export const addressProp = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (propValue !== null && propValue !== undefined) {
    addressValidator(propValue, key, componentName, location, propFullName);
  }
};

addressProp.isRequired = addressValidator;

export const tokenProp = PropTypes.shape({
  address: addressProp.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
  allowance: BigNumber,
  balance: BigNumber
});
