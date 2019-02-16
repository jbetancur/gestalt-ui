
import { getLastFromSplit } from 'util/helpers/strings';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
  SET_VOLUMES_LISTING,
  ADD_VOLUME_LISTING,
  REMOVE_VOLUME_LISTING,
  UNLOAD_VOLUMES_LISTING,
} from './actionTypes';

export function setSelectedProvider(provider = {}) {
  return {
    type: SELECTED_PROVIDER,
    providerType: getLastFromSplit(provider.resource_type),
    provider,
  };
}

export function clearSelectedProvider() {
  return {
    type: UNLOAD_SELECTED_PROVIDER,
  };
}

export function hideModal() {
  return { type: 'HIDE_MODAL' };
}

/**
 * sets the initial volumes listing for the panel list
 * @param {Array} volumes
 */
export function setVolumes(volumes) {
  return {
    type: SET_VOLUMES_LISTING,
    volumes,
  };
}

/**
 * add a volume to the volume listing
 * @param {Object} volume
 */
export function addVolume(volume) {
  return {
    type: ADD_VOLUME_LISTING,
    payload: volume,
  };
}

/**
 * remove a volume from the volume listing
 * @param {Object} volume
 */
export function removeVolume(volume) {
  return {
    type: REMOVE_VOLUME_LISTING,
    payload: volume,
  };
}

/**
 * remove a volume from the volume listing
 * @param {Object} volume
 */
export function unloadVolumes() {
  return {
    type: UNLOAD_VOLUMES_LISTING,
  };
}

export default {
  setSelectedProvider,
  clearSelectedProvider,
  hideModal,
  setVolumes,
  addVolume,
  removeVolume,
  unloadVolumes,
};
