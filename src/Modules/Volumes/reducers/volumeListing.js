// import { metaModels } from 'Modules/MetaResource';
import { insertItem, removeItem } from 'util/helpers/lists';
import {
  SET_VOLUMES_LISTING,
  ADD_VOLUME_LISTING,
  REMOVE_VOLUME_LISTING,
  UNLOAD_VOLUMES_LISTING,
} from '../constants';

const initialState = {
  volumes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_VOLUMES_LISTING:
      return initialState;
    case SET_VOLUMES_LISTING:
      return {
        volumes: action.volumes,
      };
    case ADD_VOLUME_LISTING:
      return {
        volumes: insertItem(state.volumes, action.payload)
      };
    case REMOVE_VOLUME_LISTING:
      return {
        volumes: removeItem(state.volumes, action.payload)
      };
    default:
      return state;
  }
};
