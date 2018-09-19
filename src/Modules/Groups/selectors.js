import { createSelector } from 'reselect';
import groupModel from './models/group';

export const selectGroups = state => state.groups.groups.groups;
export const selectGroup = state => state.groups.group.group;

export const getEditGroupModel = createSelector(
  [selectGroup],
  group => groupModel.create(group)
);
