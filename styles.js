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

export const fonts = StyleSheet.create({
  small: {
    fontSize: 10
  },
  large: {
    fontSize: 14
  },
  xlarge: {
    fontSize: 18
  }
});

export const images = StyleSheet.create({
  smallRounded: {
    borderRadius: 20 / 2,
    height: 20,
    width: 20
  }
});

export const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background
  },
  primary: {
    backgroundColor: colors.background
  },
  bigCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  positionBottom: {
    position: 'absolute',
    bottom: 0
  },
  paddedTop: {
    marginTop: 100,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textCenter: {
    textAlign: 'center'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  alignCenter: {
    alignItems: 'center'
  },
  alignLeft: {
    alignItems: 'flex-start'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigBottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bigTop: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  top: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bottom: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  flex0: {
    flex: 0
  },
  flex1: {
    flex: 1
  },
  flex2: {
    flex: 2
  },
  flex3: {
    flex: 3
  },
  flex4: {
    flex: 4
  },
  mh100: {
    minHeight: '100%'
  },
  h100: {
    height: '100%'
  },
  w100: {
    width: '100%'
  },
  pb0: {
    paddingBottom: 0
  },
  pb1: {
    paddingBottom: 5
  },
  pb2: {
    paddingBottom: 10
  },
  pb3: {
    paddingBottom: 15
  },
  ph0: {
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  ph1: {
    paddingHorizontal: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  ph2: {
    paddingHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  ph3: {
    paddingHorizontal: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  pv0: {
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  pv1: {
    paddingVertical: 5,
    paddingTop: 5,
    paddingBottom: 5
  },
  pv2: {
    paddingVertical: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  pv3: {
    paddingVertical: 15,
    paddingTop: 15,
    paddingBottom: 15
  },
  p0: {
    padding: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  p1: {
    padding: 5,
    paddingHorizontal: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 5,
    paddingTop: 5,
    paddingBottom: 5
  },
  p2: {
    padding: 10,
    paddingHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  p3: {
    padding: 15,
    paddingHorizontal: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    paddingTop: 15,
    paddingBottom: 15
  },
  mb0: {
    marginBottom: 0
  },
  mb1: {
    marginBottom: 5
  },
  mb2: {
    marginBottom: 10
  },
  mb3: {
    marginBottom: 15
  },
  mr0: {
    marginRight: 0
  },
  mr1: {
    marginRight: 5
  },
  mr2: {
    marginRight: 10
  },
  mr3: {
    marginRight: 15
  },
  mh0: {
    marginHorizontal: 0,
    marginLeft: 0,
    marginRight: 0
  },
  mh1: {
    marginHorizontal: 5,
    marginLeft: 5,
    marginRight: 5
  },
  mh2: {
    marginHorizontal: 10,
    marginLeft: 10,
    marginRight: 10
  },
  mh3: {
    marginHorizontal: 15,
    marginLeft: 15,
    marginRight: 15
  },
  mt0: {
    marginTop: 0
  },
  mt1: {
    marginTop: 5
  },
  mt2: {
    marginTop: 10
  },
  mt3: {
    marginTop: 15
  },
  mt4: {
    marginTop: 20
  },
  mv0: {
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0
  },
  mv1: {
    marginVertical: 5,
    marginTop: 5,
    marginBottom: 5
  },
  mv2: {
    marginVertical: 10,
    marginTop: 10,
    marginBottom: 10
  },
  mv3: {
    marginVertical: 15,
    marginTop: 15,
    marginBottom: 15
  },
  m0: {
    margin: 0,
    marginHorizontal: 0,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0
  },
  m1: {
    margin: 5,
    marginHorizontal: 5,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 5,
    marginTop: 5,
    marginBottom: 5
  },
  m2: {
    margin: 10,
    marginHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    marginTop: 10,
    marginBottom: 10
  },
  m3: {
    margin: 15,
    marginHorizontal: 15,
    marginLeft: 15,
    marginRight: 15,
    marginVertical: 15,
    marginTop: 15,
    marginBottom: 15
  },
  fluff0: {
    margin: 0,
    marginHorizontal: 0,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  normal: {
    color: colors.primary
  },
  profit: {
    color: colors.green0
  },
  loss: {
    color: colors.red0
  }
});

export const circles = StyleSheet.create({
  circle0: {
    margin: 0,
    marginHorizontal: 0,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  }
});

export function getProfitLossColor(number) {
  number = new BigNumber(number.toString());
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
