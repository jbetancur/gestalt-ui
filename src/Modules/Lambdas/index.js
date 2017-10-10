import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LambdaCreate from './containers/LambdaCreateContainer';
import LambdaEdit from './containers/LambdaEditContainer';

const LambdaRoot = () => (
  <div>
    <Switch>
      <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas/create" component={LambdaCreate} />
      <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas/:lambdaId/edit" component={LambdaEdit} />
    </Switch>
  </div>
);

export default LambdaRoot;
export { default as Lambdas } from './containers/LambdaListingContainer';
export { default as LambdaCreate } from './containers/LambdaCreateContainer';
export { default as LambdaEdit } from './containers/LambdaEditContainer';
export { default as payloadTransformer } from './payloadTransformer';
