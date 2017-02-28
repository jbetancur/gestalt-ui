import { combineReducers } from 'redux';
import fetchAll from './apiEndpoints';
import fetchOne from './apiEndpoint';
import apiEndpointUpdate from './apiEndpointUpdate';
import selectedEndpoints from './selectedEndpoints';

export default combineReducers({
  fetchAll,
  fetchOne,
  apiEndpointUpdate,
  selectedEndpoints,
});
