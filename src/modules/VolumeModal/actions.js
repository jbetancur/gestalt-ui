import {
  SHOW_VOLUME_MODAL,
  HIDE_VOLUME_MODAL,
  ADD_VOLUME,
  REMOVE_VOLUME,
  VOLUMES_UNLOADED,
} from './actionTypes';

export function showVolumeModal(action) {
  return (dispatch) => {
    dispatch({
      type: SHOW_VOLUME_MODAL,
      modalProps: {
        title: 'Create a Volume',
        onProceed: action,
      }
    });
  };
}

export function hideVolumeModal() {
  return { type: HIDE_VOLUME_MODAL };
}

export function unloadVolumes() {
  return { type: VOLUMES_UNLOADED };
}

export function addVolume(volume) {
  return { type: ADD_VOLUME, payload: volume };
}

export function removeVolume(volume) {
  return { type: REMOVE_VOLUME, payload: volume };
}

export default {
  showVolumeModal,
  hideVolumeModal,
  unloadVolumes,
  addVolume,
  removeVolume,
};
