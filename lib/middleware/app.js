import { saveState } from '../stores/app';

export const saveStateMiddleware = store => next => action => {
  try {
    return next(action);
  } finally {
    saveState(store.getState());
  }
};
