import { takeLatest, put, select, delay } from 'redux-saga/effects';
import {
  ADD_NOTIFICATION,
  // SHOW_NOTIFICATION,
  CLEAR_OLDEST_MESSAGE,
} from './actionTypes';

const TIMEOUT = 3000;

export function* clearMessage(length) {
  yield delay(TIMEOUT / length);
  yield put({ type: CLEAR_OLDEST_MESSAGE });
}

export function* onaddNotificationMessage() {
  const { queue } = yield select(state => state.notifications);

  // empty what's in the queue first
  if (queue.length > 0) {
    while (true) {
      const queueInner = yield select(state => state.notifications.queue);
      if (queueInner.length === 0) {
        break;
      }

      yield clearMessage(queueInner.length);
    }
  }
}

// Watchers
export default function* () {
  yield takeLatest(ADD_NOTIFICATION, onaddNotificationMessage);
}
