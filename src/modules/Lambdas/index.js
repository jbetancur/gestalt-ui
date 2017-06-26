import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LambdaCreate from './containers/LambdaCreate';
import LambdaEdit from './containers/LambdaEdit';

const LambdaRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas/create'} component={LambdaCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas/:lambdaId/edit'} component={LambdaEdit} />
    </Switch>
  </div>
);

export default LambdaRoot;
export { default as Lambdas } from './containers/LambdaListing';
export { default as LambdaCreate } from './containers/LambdaCreate';
export { default as LambdaEdit } from './containers/LambdaEdit';
