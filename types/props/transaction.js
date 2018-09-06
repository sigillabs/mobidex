import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import { addressProp } from './address';

const transactionIdValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (typeof propValue !== 'string') {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }

  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(propValue)) {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }
};

export const transactionIdProp = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (propValue !== null && propValue !== undefined) {
    transactionIdValidator(
      propValue,
      key,
      componentName,
      location,
      propFullName
    );
  }
};

export const transactionProp = PropTypes.shape({
  id: transactionIdProp.isRequired,
  from: addressProp.isRequired,
  to: addressProp.isRequired,
  type: PropTypes.string.isRequired,
  amount: PropTypes.instanceOf(BigNumber)
});
