export function confirmDelete(action, item, HierarchyType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to delete the "${item}" ${HierarchyType}?`,
      body: `All items within "${item}" will be deleted. This action CANNOT be undone!`,
      values: { name: item, type: HierarchyType },
      requireConfirm: true,
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
  confirmDelete,
  showEntitlementsModal,
};
