import { Dimensions } from 'react-native';
import { handleActions } from 'redux-actions';

const initialState = {
  layout: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
};

export default handleActions({}, initialState);
