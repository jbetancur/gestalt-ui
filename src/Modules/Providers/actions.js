import {
  SELECTED_PROVIDERTYPE_REQUEST,
  TOGGLE_HAS_CONTAINER,
} from './actionTypes';

/**
 * setSelectedProviderType
 * @param {*} provider
 */
export function setSelectedProviderType({ fqon, providerType = {} }) {
  return {
    type: SELECTED_PROVIDERTYPE_REQUEST,
    fqon,
    providerType,
  };
}

/**
 * toggleHasContainer
 * @param {*} provider
 */
export function toggleHasContainer(checkState) {
  return {
    type: TOGGLE_HAS_CONTAINER,
    checkState,
  };
}

export default {
  setSelectedProviderType,
  toggleHasContainer,
};
