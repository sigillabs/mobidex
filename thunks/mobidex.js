import MobidexClient from '../clients/mobidex';
import { setReferralCode } from '../actions';

export function addReferrer(code) {
  return async (dispatch, getState) => {
    let {
      settings: { mobidexEndpoint },
      wallet: { address }
    } = getState();
    const client = new MobidexClient(mobidexEndpoint);
    const user = await client.addReferral(address, code);

    dispatch(setReferralCode(user.referralCode));
  };
}

export function loadUser() {
  return async (dispatch, getState) => {
    let {
      settings: { mobidexEndpoint },
      wallet: { address }
    } = getState();
    const client = new MobidexClient(mobidexEndpoint);
    const user = await client.getUser(address);

    dispatch(setReferralCode(user.referralCode));
  };
}
