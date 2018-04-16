import OnboardingNavigator from '../App/Onboarding/Navigation';
import MainNavigator from '../App/Main/Navigation';

const initialState = {
  onboarding: OnboardingNavigator.router.getStateForAction(
    OnboardingNavigator.router.getActionForPathAndParams('Intro')
  ),
  main: MainNavigator.router.getStateForAction(
    MainNavigator.router.getActionForPathAndParams('Wallet')
  )
};

const navigation = (state = initialState, action) => {
  return {
    onboarding:
      OnboardingNavigator.router.getStateForAction(action, state.onboarding) ||
      state.onboarding,
    main:
      MainNavigator.router.getStateForAction(action, state.main) || state.main
  };
};

export default navigation;
