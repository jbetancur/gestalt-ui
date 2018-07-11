import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectGroups = state => state.metaResource.groups.groups;
export const selectGroup = state => state.metaResource.group.group;

export const getEditGroupModel = createSelector(
  [selectGroup],
  group => metaModels.group.create(group)
);
