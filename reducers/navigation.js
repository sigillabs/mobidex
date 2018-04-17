import Navigator from '../App/Navigation';

const initialState = Navigator.router.getStateForAction(
  Navigator.router.getActionForPathAndParams('Loading')
);

const navigation = (state = initialState, action) => {
  return Navigator.router.getStateForAction(action, state) || state;
};

export default navigation;
