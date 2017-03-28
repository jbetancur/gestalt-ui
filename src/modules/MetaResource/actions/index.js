import context from './context';
import organizations from './organizations';
import workspaces from './workspaces';
import environments from './environments';
import self from './self';

export default Object.assign({},
  context,
  organizations,
  workspaces,
  environments,
  self,
);
