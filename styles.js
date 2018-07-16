import { StyleSheet } from 'react-native';

export const colors = {
  primary: 'black',
  secondary: '#8F0CE8',
  background: 'white',
  success: 'green',

  error: '#ff190c',
  green0: 'green',
  grey0: '#393e42',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#86939e',
  grey4: '#bdc6cf',
  grey5: '#e1e8ee',
  grey6: '#EFEFEF',
  orange0: '#ff9200',
  orange1: '#F37438',
  red0: '#ff190c',
  yellow0: '#ffb22c',
  white: 'white',
  transparent: 'transparent'
};

export const small = {
  fontSize: 10
};

export const background = {
  backgroundColor: colors.background
};

export const primary = {
  backgroundColor: colors.background
};

export const textcenter = {
  textAlign: 'center'
};

export const center = {
  justifyContent: 'center',
  alignItems: 'center'
};

export const bigcenter = [
  {
    flex: 1,
    flexDirection: 'column'
  },
  center
];

export const bigtop = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

export const bigbottom = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center'
};

export const row = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

export const flex0 = {
  flex: 0
};

export const flex1 = {
  flex: 1
};

export const flex2 = {
  flex: 2
};

export const padding0 = {
  padding: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0
};

export const margin0 = {
  margin: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0
};

export const fluff0 = [padding0, margin0];

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
