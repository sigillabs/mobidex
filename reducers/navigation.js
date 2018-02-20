import AppNavigator from "../navigation";

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams("Wallet"));

const navigation = (state = initialState, action) => {
  return AppNavigator.router.getStateForAction(action, state) || state;
};

export default navigation;