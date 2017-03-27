import context from './context';
import organizations from './organizations';
import workspaces from './workspaces';
import environments from './environments';
import users from './users';

export default Object.assign({},
  context,
  organizations,
  workspaces,
  environments,
  users,
);
