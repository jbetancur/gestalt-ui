export function confirmDelete(action, item, HierarchyType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'CONFIRM',
    modalProps: {
      title: `Are you sure you want to delete the "${item}" ${HierarchyType}?`,
      values: { name: item, type: HierarchyType },
      requireConfirm: true,
      onProceed: action,
    }
  };
}

export default {
  confirmDelete,
};
