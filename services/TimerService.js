import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';

export default class TimerService {
  static instance = null;

  constructor(interval) {
    this.interval = interval;
    this.running = false;
    this.events = [];
  }

  start() {
    if (!this.running) {
      this.running = true;
      BackgroundTimer.runBackgroundTimer(() => {
        const current = moment().unix();
        const remove = [];
        for (const index in this.events) {
          const { fn, start, duration } = this.events[index];
          if (current - start >= duration) {
            remove.push(index);
            fn();
          }
        }
        remove.reverse();
        for (const index of remove) {
          this.events.splice(index, 1);
        }
      }, this.interval);
    }
  }

  stop() {
    if (this.running) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }

  setTimeout(fn, duration) {
    const start = moment().unix();
    this.events.push({
      duration,
      fn,
      start
    });
  }

  static getInstance(interval = 60 * 1000) {
    if (TimerService.instance === null) {
      TimerService.instance = new TimerService(interval);
    }

    return TimerService.instance;
  }
}
