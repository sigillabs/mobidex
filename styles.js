import { BigNumber } from '0x.js';
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

export const top = {
  justifyContent: 'flex-start',
  alignItems: 'center'
};

export const bottom = {
  justifyContent: 'flex-end',
  alignItems: 'center'
};

export const bigcenter = [
  {
    flex: 1,
    flexDirection: 'column'
  },
  center
];

export const bigtop = [
  {
    flex: 1,
    flexDirection: 'column'
  },
  top
];

export const bigbottom = [
  {
    flex: 1,
    flexDirection: 'column'
  },
  bottom
];

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

export const ph0 = {
  paddingHorizontal: 0,
  paddingLeft: 0,
  paddingRight: 0
};

export const ph1 = {
  paddingHorizontal: 5,
  paddingLeft: 5,
  paddingRight: 5
};

export const ph2 = {
  paddingHorizontal: ph1.paddingHorizontal * 2,
  paddingLeft: ph1.paddingLeft * 2,
  paddingRight: ph1.paddingRight * 2
};

export const ph3 = {
  paddingHorizontal: ph1.paddingHorizontal * 3,
  paddingLeft: ph1.paddingLeft * 3,
  paddingRight: ph1.paddingRight * 3
};

export const pv0 = {
  paddingVertical: 0,
  paddingTop: 0,
  paddingBottom: 0
};

export const pv1 = {
  paddingVertical: 5,
  paddingTop: 5,
  paddingBottom: 5
};

export const pv2 = {
  paddingVertical: pv1.paddingVertical * 2,
  paddingTop: pv1.paddingTop * 2,
  paddingBottom: pv1.paddingBottom * 2
};

export const pv3 = {
  paddingVertical: pv1.paddingVertical * 3,
  paddingTop: pv1.paddingTop * 3,
  paddingBottom: pv1.paddingBottom * 3
};

export const padding0 = [
  {
    padding: 0
  },
  ph0,
  pv0
];

export const padding1 = [
  {
    padding: 5
  },
  ph1,
  pv1
];

export const padding2 = [
  {
    padding: padding1.padding * 2
  },
  ph2,
  pv2
];

export const padding3 = [
  {
    padding: padding1.padding * 3
  },
  ph2,
  pv2
];

export const mh0 = {
  marginHorizontal: 0,
  marginLeft: 0,
  marginRight: 0
};

export const mh1 = {
  marginHorizontal: 5,
  marginLeft: 5,
  marginRight: 5
};

export const mh2 = {
  marginHorizontal: mh1.marginHorizontal * 2,
  marginLeft: mh1.marginLeft * 2,
  marginRight: mh1.marginRight * 2
};

export const mh3 = {
  marginHorizontal: mh1.marginHorizontal * 3,
  marginLeft: mh1.marginLeft * 3,
  marginRight: mh1.marginRight * 3
};

export const mv0 = {
  marginVertical: 0,
  marginTop: 0,
  marginBottom: 0
};

export const mv1 = {
  marginVertical: 5,
  marginTop: 5,
  marginBottom: 5
};

export const mv2 = {
  marginVertical: mv1.marginVertical * 2,
  marginTop: mv1.marginTop * 2,
  marginBottom: mv1.marginBottom * 2
};

export const mv3 = {
  marginVertical: mv1.marginVertical * 3,
  marginTop: mv1.marginTop * 3,
  marginBottom: mv1.marginBottom * 3
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
  number = new BigNumber(number);
  if (number.gt(0)) {
    return colors.green0;
  } else if (number.lt(0)) {
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
