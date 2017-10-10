import React from 'react';
import { Switch, Route } from 'react-router-dom';
import APICreate from './containers/APIEndpointCreateContainer';
import APIEdit from './containers/APIEndpointEditContainer';

const APIRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit/apiendpoints/createEndpoint" component={APICreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit/apiendpoints/:apiEndpointId/editEndpoint" component={APIEdit} />
  </Switch>
);

export default APIRoot;
export { default as APIEndpoints } from './containers/APIEndpointListingContainer';
export { default as APIEndpointCreate } from './containers/APIEndpointCreateContainer';
export { default as APIEndpointEdit } from './containers/APIEndpointEditContainer';
export { default as payloadTransformer } from './payloadTransformer';
