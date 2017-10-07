import {
  HIERARCHY_NAVIGATION,
  WORKSPACES_NAVIGATION,
  ENVIRONMENTS_NAVIGATION,
  UNLOAD_HIERARCHY_NAVIGATION,
  UNLOAD_WORKSPACES_NAVIGATION,
  UNLOAD_ENVIRONMENTS_NAVIGATION
} from './actionTypes';

export function handleNavigation(type, view, index) {
  const payload = {
    view,
    index
  };

  switch (type) {
    case 'hierarchy':
      return { type: HIERARCHY_NAVIGATION, payload };
    case 'workspace':
      return { type: WORKSPACES_NAVIGATION, payload };
    case 'environment':
      return { type: ENVIRONMENTS_NAVIGATION, payload };
    default:
      return { type: HIERARCHY_NAVIGATION, payload };
  }
}

export function unloadNavigation(type) {
  switch (type) {
    case 'hierarchy':
      return { type: UNLOAD_HIERARCHY_NAVIGATION };
    case 'workspace':
      return { type: UNLOAD_WORKSPACES_NAVIGATION };
    case 'environment':
      return { type: UNLOAD_ENVIRONMENTS_NAVIGATION };
    default:
      return { type: UNLOAD_HIERARCHY_NAVIGATION };
  }
}

export function confirmDelete(action, item, HierarchyType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to delete the ${item} ${HierarchyType}?`,
      body: `All items within ${item} will be deleted. This action cannot be undone.`,
      onProceed: action,
    }
  };
}

export function showEntitlementsModal(item, params, HierarchyType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'EntitlementModal',
    modalProps: {
      title: `Entitlements for "${item}" ${HierarchyType || ''}`,
      params,
    }
  };
}

export default {
  handleNavigation,
  unloadNavigation,
  confirmDelete,
  showEntitlementsModal,
};
