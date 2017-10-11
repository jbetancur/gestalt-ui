import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Groups from './containers/GroupListingContainer';
import GroupCreate from './containers/GroupCreateContainer';
import GroupEdit from './containers/GroupEditContainer';

const GroupRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/groups" component={Groups} />
    <Route exact path="/:fqon/hierarchy/groups/create" component={GroupCreate} />
    <Route exact path="/:fqon/hierarchy/groups/:groupId/edit" component={GroupEdit} />
  </Switch>
);

export default GroupRoot;
export { default as Groups } from './containers/GroupListingContainer';
export { default as GroupCreate } from './containers/GroupCreateContainer';
export { default as GroupEdit } from './containers/GroupEditContainer';
