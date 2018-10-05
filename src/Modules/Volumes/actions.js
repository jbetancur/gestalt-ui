
import { getLastFromSplit } from 'util/helpers/strings';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
  SET_VOLUMES_LISTING,
  ADD_VOLUME_LISTING,
  REMOVE_VOLUME_LISTING,
  UNLOAD_VOLUMES_LISTING,
} from './constants';

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

export function confirmDelete(action, title, multipleItems) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title,
      multipleItems,
      forceOption: false,
      onProceed: action,
    }
  };
}

/**
 * showVolumeCreateModal =- opens Volume Attach/Create Modal
 */
export function showVolumeCreateModal(mode, selectedProvider, volumes = [], volumesDropdown = []) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'VolumeCreateModal',
    modalProps: {
      mode,
      selectedProvider,
      volumes,
      volumesDropdown,
    }
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
  confirmDelete,
  showVolumeCreateModal,
  hideModal,
  setVolumes,
  addVolume,
  removeVolume,
  unloadVolumes,
};
