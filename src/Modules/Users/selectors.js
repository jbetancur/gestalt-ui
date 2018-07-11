import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectUsers = state => state.metaResource.users.users;
export const selectUser = state => state.metaResource.user.user;

export const getEditUserModel = createSelector(
  [selectUser],
  user => metaModels.user.create(user)
);
