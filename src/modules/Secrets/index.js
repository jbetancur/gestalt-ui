import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SecretCreate from './containers/SecretCreate';
import SecretEdit from './containers/SecretEdit';

const SecretRoot = () => (
  <Switch>
    <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/secrets/create'} component={SecretCreate} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/secrets/:secretId/edit'} component={SecretEdit} />
  </Switch>
);

export default SecretRoot;
export { default as Secrets } from './containers/SecretListing';
export { default as SecretCreate } from './containers/SecretCreate';
export { default as SecretEdit } from './containers/SecretEdit';
export { default as payloadTransformer } from './payloadTransformer';
// export { default as SecretsPanel } from './components/SecretsPanel';
