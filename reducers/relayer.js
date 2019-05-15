import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import Orderbook from '../lib/orderbook';

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
        assets: _.unionBy(action.payload, state.assets, 'assetData')
      };
    },
    [Actions.APPEND_ORDERBOOK]: (state, action) => {
      state.orders = _.unionBy(action.payload, state.orders, 'orderHash');

      for (const order of action.payload) {
        if (
          state.orderbooks[order.makerAssetData] &&
          state.orderbooks[order.makerAssetData][order.takerAssetData]
        ) {
          state.orderbooks[order.makerAssetData][order.takerAssetData].add(
            order
          );
        } else if (
          state.orderbooks[order.takerAssetData] &&
          state.orderbooks[order.takerAssetData][order.makerAssetData]
        ) {
          state.orderbooks[order.takerAssetData][order.makerAssetData].add(
            order
          );
        }
      }

      return {
        ...state
      };
    },
    [Actions.SET_ORDERBOOK]: (state, action) => {
      const [baseAssetData, quoteAssetData, bids, asks] = action.payload;

      if (!state.orderbooks[baseAssetData])
        state.orderbooks[baseAssetData] = {};
      state.orderbooks[baseAssetData][quoteAssetData] = new Orderbook(
        baseAssetData,
        quoteAssetData
      );

      for (const order of bids) {
        state.orderbooks[baseAssetData][quoteAssetData].add(order);
      }

      for (const order of asks) {
        state.orderbooks[baseAssetData][quoteAssetData].add(order);
      }

      return {
        ...state,
        orderbooks: state.orderbooks
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
