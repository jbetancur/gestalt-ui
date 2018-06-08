import { call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

export function* poll(method, action) {
  while (true) {
    try {
      yield call(delay, 5000);
      yield call(method, { ...action, isPolling: true });
    } catch (error) {
      // cancellation error -- can handle this if you wish
    }
  }
}
