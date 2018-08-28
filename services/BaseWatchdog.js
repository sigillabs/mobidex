import { InteractionManager } from 'react-native';

export default class BaseWatchdog {
  constructor(timeout = 1000) {
    this.timeout = timeout;
    this.timer = null;
  }

  start() {
    if (this.timer === null) {
      this.run();
    }
  }

  stop() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  async run() {
    InteractionManager.runAfterInteractions(async () => {
      try {
        await this.exec();
      } catch (err) {
        console.warn(err.message);
      }

      this.timer = setTimeout(this.run.bind(this), this.timeout);
    });
  }

  async exec() {
    throw new Error('You have to implement the method exec()!');
  }
}
