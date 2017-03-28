import {
  SHOW_PORTMAP_MODAL,
  HIDE_PORTMAP_MODAL,
  ADD_PORTMAPPING,
  REMOVE_PORTMAPPING,
  UNLOAD_PORTMAPPINGS,
} from './actionTypes';

export function showPortmapModal(action) {
  return (dispatch) => {
    dispatch({
      type: SHOW_PORTMAP_MODAL,
      modalProps: {
        title: 'Create a Port Mapping',
        onProceed: action,
      }
    });
  };
}

export function hidePortmapModal() {
  return { type: HIDE_PORTMAP_MODAL };
}

export function unloadPortmappings() {
  return { type: UNLOAD_PORTMAPPINGS };
}

export function addPortmapping(portmap) {
  return { type: ADD_PORTMAPPING, payload: portmap };
}

export function removePortmapping(portmap) {
  return { type: REMOVE_PORTMAPPING, payload: portmap };
}

export default {
  showPortmapModal,
  hidePortmapModal,
  unloadPortmappings,
  addPortmapping,
  removePortmapping,
};
