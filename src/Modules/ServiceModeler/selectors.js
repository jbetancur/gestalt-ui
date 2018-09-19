import { createSelector } from 'reselect';
import serviceSpecModel from './models/serviceSpec';

export const getServiceSpecModel = createSelector(
  [],
  () => serviceSpecModel.get()
);
