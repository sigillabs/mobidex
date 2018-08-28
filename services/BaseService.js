const SERVICES = {};

export default class BaseService {
  constructor(store) {
    this.store = store;
    SERVICES[this.constructor.name] = this;
  }

  static get instance() {
    return SERVICES[this.name];
  }
}
