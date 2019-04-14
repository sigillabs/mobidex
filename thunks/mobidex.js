import MobidexClient from '../clients/mobidex';
import { setUser } from '../actions';

export function addReferrer(code) {
  return async (dispatch, getState) => {
    let {
      settings: { mobidexEndpoint },
      wallet: { address }
    } = getState();
    const client = new MobidexClient(mobidexEndpoint);
    const user = await client.addReferral(address, code);

    dispatch(setUser(user));
  };
}

export function loadUser() {
  return async (dispatch, getState) => {
    let {
      settings: { mobidexEndpoint },
      wallet: { address }
    } = getState();

    try {
      const client = new MobidexClient(mobidexEndpoint);
      const user = await client.getUser(address);
      dispatch(setUser(user));
    } catch (err) {
      console.warn(err.message);
    }
  };
}
