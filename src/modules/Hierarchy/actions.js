import {
  WORKSPACES_NAVIGATION,
  ENVIRONMENTS_NAVIGATION,
} from './actionTypes';

export function handleWorkspaceNavigation(view, index) {
  const payload = {
    view,
    index
  };

  return { type: WORKSPACES_NAVIGATION, payload };
}

export function handleEnvironmentNavigation(view, index) {
  const payload = {
    view,
    index
  };

  return { type: ENVIRONMENTS_NAVIGATION, payload };
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
