import {
  SHOW_NETWORK_MODAL,
  HIDE_NETWORK_MODAL,
  ADD_NETWORK,
  REMOVE_NETWORK,
  NETWORKS_UNLOADED,
} from './actionTypes';

export function showNetworkModal(action) {
  return (dispatch) => {
    dispatch({
      type: SHOW_NETWORK_MODAL,
      modalProps: {
        title: 'Create a Network',
        onProceed: action,
      }
    });
  };
}

export function hideNetworkModal() {
  return { type: HIDE_NETWORK_MODAL };
}

export function unloadNetworks() {
  return { type: NETWORKS_UNLOADED };
}

export function addNetwork(network) {
  return { type: ADD_NETWORK, payload: network };
}

export function removeNetwork(network) {
  return { type: REMOVE_NETWORK, payload: network };
}

export default { showNetworkModal, hideNetworkModal, unloadNetworks, addNetwork, removeNetwork };
