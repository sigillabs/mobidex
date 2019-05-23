import { authorize as appAuthorize } from 'react-native-app-auth';
import { setBitskiCredentials as _setBitskiCredentials } from '../actions';
import { saveState } from '../lib/stores/bitski';
import { showErrorModal } from '../navigation';

export function setBitskiCredentials(credentials) {
  return async dispatch => {
    dispatch(_setBitskiCredentials(credentials));
    try {
      return await saveState(credentials);
    } catch (error) {
      showErrorModal(error);
    }
  };
}

/*
Example Response:
{
  "additionalParameters": {},
  "scopes": [
    "openid",
    "offline"
  ],
  "idToken": "<>",
  "accessToken": "<>",
  "tokenAdditionalParameters": {},
  "refreshToken": "<>",
  "tokenType": "bearer",
  "authorizeAdditionalParameters": {},
  "accessTokenExpirationDate": "2019-05-23T02:49:05Z"
}
*/
export function authorizeBitski() {
  return async (dispatch, getState) => {
    const {
      settings: {
        bitski: { auth }
      }
    } = getState();

    const result = await appAuthorize(auth);
    return dispatch(setBitskiCredentials(result));
  };
}
