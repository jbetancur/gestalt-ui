import React from 'react';
import { Switch, Route } from 'react-router-dom';
import APIEndpointsRoot from 'Modules/APIEndpoints';
import APIListing from './containers/APIListingContainer';
import APICreate from './containers/APICreateContainer';
import APIEdit from './containers/APIEditContainer';

const APIRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis'} component={APIListing} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/create'} component={APICreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit'} component={APIEdit} />
      <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis/:apiId/edit/apiendpoints'} component={APIEndpointsRoot} />
    </Switch>
  </div>
);

export default APIRoot;
export { default as APIs } from './containers/APIListingContainer';
export { default as APICreate } from './containers/APICreateContainer';
export { default as APIEdit } from './containers/APIEditContainer';
export { default as payloadTransformer } from './payloadTransformer';
