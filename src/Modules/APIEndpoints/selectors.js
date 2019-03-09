import { createSelector } from 'reselect';
import apiEndpointModel from './models/apiEndpoint';

export const selectAPIEndpoint = state => state.apiEndpoints.apiEndpoint.apiEndpoint;

export const getCreateEndpointModel = createSelector(
  [],
  () => apiEndpointModel.get()
);

export const getEditEndpointModel = createSelector(
  [selectAPIEndpoint],
  apiEndpoint => apiEndpointModel.create(apiEndpoint),
);
