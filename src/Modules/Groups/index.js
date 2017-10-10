import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Groups from './containers/GroupListing';
import GroupCreate from './containers/GroupCreate';
import GroupEdit from './containers/GroupEdit';

const GroupRoot = () => (
  <div>
    <Switch>
      <Route exact path="/:fqon/hierarchy/groups" component={Groups} />
      <Route exact path="/:fqon/hierarchy/groups/create" component={GroupCreate} />
      <Route exact path="/:fqon/hierarchy/groups/:groupId/edit" component={GroupEdit} />
    </Switch>
  </div>
);

export default GroupRoot;
export { default as Groups } from './containers/GroupListing';
export { default as GroupCreate } from './containers/GroupCreate';
export { default as GroupEdit } from './containers/GroupEdit';
