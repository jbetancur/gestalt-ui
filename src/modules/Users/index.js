import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserListing from './containers/UserListing';
import UserCreate from './containers/UserCreate';
import UserEdit from './containers/UserEdit';

const UserRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/users'} component={UserListing} />
      <Route exact path={'/:fqon/users/create'} component={UserCreate} />
      <Route exact path={'/:fqon/users/:userId/edit'} component={UserEdit} />
    </Switch>
  </div>
);

export default UserRoot;
export { default as Users } from './containers/UserListing';
export { default as UserCreate } from './containers/UserCreate';
export { default as UserEdit } from './containers/UserEdit';
