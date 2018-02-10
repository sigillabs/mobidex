import Navigator from "../navigation";

const initialState = Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams('Trading'));

export default (state = initialState, action) => {
  const nextState = Navigator.router.getStateForAction(action, state);

  return nextState || state;
};
