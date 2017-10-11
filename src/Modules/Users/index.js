import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserListing from './containers/UserListingContainer';
import UserCreate from './containers/UserCreateContainer';
import UserEdit from './containers/UserEditContainer';

const UserRoot = () => (
  <div>
    <Switch>
      <Route exact path="/:fqon/hierarchy/users" component={UserListing} />
      <Route exact path="/:fqon/hierarchy/users/create" component={UserCreate} />
      <Route exact path="/:fqon/hierarchy/users/:userId/edit" component={UserEdit} />
    </Switch>
  </div>
);

export default UserRoot;
export { default as Users } from './containers/UserListingContainer';
export { default as UserCreate } from './containers/UserCreateContainer';
export { default as UserEdit } from './containers/UserEditContainer';
