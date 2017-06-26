import React from 'react';
import { Switch, Route } from 'react-router-dom';
import APICreate from './containers/APIEndpointCreate';
import APIEdit from './containers/APIEndpointEdit';

const APIRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit/apiendpoints/createEndpoint'} component={APICreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit/apiendpoints/:apiEndpointId/editEndpoint'} component={APIEdit} />
    </Switch>
  </div>
);

export default APIRoot;
export { default as APIEndpoints } from './containers/APIEndpointListing';
export { default as APIEndpointCreate } from './containers/APIEndpointCreate';
export { default as APIEndpointEdit } from './containers/APIEndpointEdit';
