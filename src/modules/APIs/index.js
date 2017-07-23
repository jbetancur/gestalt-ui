import React from 'react';
import { Switch, Route } from 'react-router-dom';
import APIEndpointsRoot from 'modules/APIEndpoints';
import APIListing from './containers/APIListing';
import APICreate from './containers/APICreate';
import APIEdit from './containers/APIEdit';

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
export { default as APIs } from './containers/APIListing';
export { default as APICreate } from './containers/APICreate';
export { default as APIEdit } from './containers/APIEdit';
export { default as payloadTransformer } from './payloadTransformer';
