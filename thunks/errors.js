import { NavigationActions } from "react-navigation";

export function displayError(error) {
  return (dispatch, getState) => {
    dispatch(NavigationActions.navigate({ routeName: "Error" }));
  };
}
