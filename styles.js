import { StyleSheet } from 'react-native';

const colors = {
  primary: 'black',
  secondary: '#8F0CE8',
  background: 'white',

  error: '#ff190c',
  green0: 'green',
  grey0: '#393e42',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#86939e',
  grey4: '#bdc6cf',
  grey5: '#e1e8ee',
  orange0: '#ff9200',
  orange1: '#F37438',
  red0: '#ff190c',
  yellow0: '#ffb22c',
  white: 'white',
  transparent: 'transparent'
};

const small = {
  fontSize: 10
};

export function getProfitLossColor(number) {
  if (number > 0) {
    return colors.green0;
  } else if (number < 0) {
    return colors.red0;
  } else {
    return colors.primary;
  }
}

export function getProfitLossStyle(number) {
  return {
    color: getProfitLossColor(number)
  };
}

export { colors, small };
