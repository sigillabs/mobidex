import { time } from '../lib/decorators/cls';

export default class MobidexClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  @time
  async addReferral(address, code) {
    const response = await fetch(`${this.endpoint}/user/${address}/referral`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        referrerCode: code
      })
    });
    const json = await response.json();

    return json;
  }

  @time
  async getUser(address) {
    const response = await fetch(`${this.endpoint}/user/${address}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();

    return json;
  }
}
