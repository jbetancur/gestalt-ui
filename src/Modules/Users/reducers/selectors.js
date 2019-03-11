import { createSelector } from 'reselect';
import userModel from '../models/user';

export const selectUsers = state => state.users.users.users;
export const selectUser = state => state.users.user.user;

export const getEditUserModel = createSelector(
  [selectUser],
  user => userModel.create(user)
);
