import { combineReducers } from 'redux';

import fetchAll from './organizations';
import fetchOne from './organization';
import fetchSet from './organizationSet';

export default combineReducers({
  fetchAll,
  fetchOne,
  fetchSet
});
