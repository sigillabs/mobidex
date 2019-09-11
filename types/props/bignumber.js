import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';

export const BigNumberProp = PropTypes.oneOfType([
  PropTypes.instanceOf(BigNumber),
  PropTypes.number,
  PropTypes.string,
]);
