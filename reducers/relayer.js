import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  orderbooks: {},
  orders: [],
  products: [],
  assets: []
};

export default handleActions(
  {
    [Actions.ADD_ASSETS]: (state, action) => {
      return {
        ...state,
        assets: _.unionBy(state.assets, action.payload, 'assetData')
      };
    },
    [Actions.ADD_ORDERS]: (state, action) => {
      return {
        ...state,
        orders: _.unionBy(state.orders, action.payload, 'orderHash')
      };
    },
    [Actions.SET_ORDERBOOK]: (state, action) => {
      const [product, orderbook] = action.payload;
      return {
        ...state,
        orderbooks: { ...state.orderbooks, [product]: orderbook }
      };
    },
    [Actions.SET_ORDERS]: (state, action) => {
      return { ...state, orders: action.payload };
    },
    [Actions.SET_PRODUCTS]: (state, action) => {
      return { ...state, products: action.payload };
    }
  },
  initialState
);
