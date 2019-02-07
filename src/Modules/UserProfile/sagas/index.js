import { all } from 'redux-saga/effects';

import userProfile from './userProfile';

export default function* userProfileSagas() {
  yield all([
    userProfile(),
  ]);
}
