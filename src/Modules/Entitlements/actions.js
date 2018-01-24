/**
 * hideEntitlementsModal
 */
export function hideEntitlementsModal() {
  return { type: 'HIDE_MODAL' };
}

/**
 * showEntitlementsModal
 * @param {*} item
 * @param {*} fqon
 * @param {*} entityId
 * @param {*} entityKey
 * @param {*} HierarchyType
 */
export function showEntitlementsModal(item, fqon, entityId, entityKey, HierarchyType) {
  return {
    type: 'SHOW_MODAL',
    modalType: 'EntitlementModal',
    modalProps: {
      title: `Entitlements for "${item}" ${HierarchyType || ''}`,
      fqon,
      entityId,
      entityKey,
    }
  };
}

export default {
  hideEntitlementsModal,
  showEntitlementsModal,
};
