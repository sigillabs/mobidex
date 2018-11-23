import { InteractionManager } from 'react-native';
import TimerService from './TimerService';

export default class BaseWatchdog {
  constructor(timeout = 10) {
    this.timeout = timeout;
  }

  start() {
    TimerService.getInstance().setTimeout(this.run.bind(this), this.timeout);
  }

  stop() {}

  async run() {
    InteractionManager.runAfterInteractions(async () => {
      try {
        await this.exec();
      } catch (err) {
        console.warn(err.message);
      }

      TimerService.getInstance().setTimeout(this.run.bind(this), this.timeout);
    });
  }

  async exec() {
    throw new Error('You have to implement the method exec()!');
  }
}
