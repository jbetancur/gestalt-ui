import { createSelector } from 'reselect';
import { get } from 'lodash';
import { isRecentWithin } from 'util/helpers/dates';

const selectItems = (state, selector) => {
  if (typeof selector === 'function') {
    return selector(state);
  }

  return get(state, selector);
};

const getVisibilityFilter = state => state.listfilter.filter;
const selectSelf = state => state.hierarchy.self.self;

const getVisibleItems = createSelector(
  [getVisibilityFilter, selectItems, selectSelf],
  (visibilityFilter, items, self) => {
    switch (visibilityFilter.filter) {
      case 'SHOW_ALL':
        return items;
      case 'SHOW_SELF':
        return items.filter(i => i.owner.name === self.name);
      case 'SHOW_OTHERS':
        return items.filter(i => i.owner.name !== self.name);
      case 'SHOW_CREATED_TODAY':
        return items.filter(i => isRecentWithin(i.created.timestamp, 1, 'day'));
      case 'SHOW_MODIFIED_TODAY':
        return items.filter(i => isRecentWithin(i.modified.timestamp, 1, 'day'));
      default:
        return items;
    }
  }
);

export const filterItems = (fields = ['name']) => createSelector(
  [getVisibleItems, getVisibilityFilter],
  (items = [], visibilityFilter) => items
    .filter(i => fields.some(f => i[f]
      .includes(visibilityFilter.filterText)))
);

export default {
  filterItems,
};
