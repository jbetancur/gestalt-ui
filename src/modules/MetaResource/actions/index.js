import context from './context';
import organizations from './organizations';
import workspaces from './workspaces';
import environments from './environments';
import lambdas from './lambdas';
import apis from './apis';
import apiEndpoints from './apiEndpoints';
import providers from './providers';
import env from './env';
import self from './self';

export default Object.assign({},
  context,
  organizations,
  workspaces,
  environments,
  lambdas,
  apis,
  apiEndpoints,
  providers,
  env,
  self,
);
