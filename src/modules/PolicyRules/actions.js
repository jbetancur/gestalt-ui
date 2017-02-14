import axios from 'axios';
import { goBack } from 'react-router-redux';
import { toggleHandler } from 'util/helpers/lists';
import {
  FETCH_POLICYRULES_PENDING,
  FETCH_POLICYRULES_REJECTED,
  FETCH_POLICYRULES_FULFILLED,
  POLICYRULE_UNLOADED,
  POLICYRULES_UNLOADED,
  SELECTED_POLICYRULES,
  FETCH_POLICYRULE_PENDING,
  FETCH_POLICYRULE_FULFILLED,
  FETCH_POLICYRULE_REJECTED,
  CREATE_POLICYRULE_PENDING,
  CREATE_POLICYRULE_FULFILLED,
  CREATE_POLICYRULE_REJECTED,
  UPDATE_POLICYRULE_PENDING,
  UPDATE_POLICYRULE_FULFILLED,
  UPDATE_POLICYRULE_REJECTED,
  DELETE_POLICYRULE_PENDING,
  DELETE_POLICYRULE_FULFILLED,
  DELETE_POLICYRULE_REJECTED,
  SELECTED_ACTIONS,
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  LAMBDAS_UNLOADED,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: POLICYRULE_UNLOADED });
  };
}

export function onUnloadListing() {
  return (dispatch) => {
    dispatch({ type: POLICYRULES_UNLOADED });
  };
}

export function onUnloadLambdas() {
  return (dispatch) => {
    dispatch({ type: LAMBDAS_UNLOADED });
  };
}

export function handleSelected(row, toggled, selectedCount, list, selectedItems) {
  const payload = {
    selectedCount,
    showTitle: selectedCount <= 0,
    selectedItems: toggleHandler(row, toggled, selectedCount, selectedItems, list)
  };

  return { type: SELECTED_POLICYRULES, payload };
}

export function clearSelected() {
  const payload = {
    selectedCount: 0,
    showTitle: true,
    selectedItems: []
  };

  return { type: SELECTED_POLICYRULES, payload };
}

export function handleSelectedActions(action, selectedActions) {
  const actions = selectedActions.slice();

  if (action) {
    const index = selectedActions.indexOf(action);
    if (index > -1) {
      actions.splice(index, 1);
    } else {
      actions.push(action);
    }
  }

  return { type: SELECTED_ACTIONS, payload: actions };
}

export function clearSelectedActions() {
  return { type: SELECTED_ACTIONS, payload: [] };
}

export function fetchPolicyRules(fqon, policyId) {
  return (dispatch) => {
    dispatch({ type: FETCH_POLICYRULES_PENDING });
    axios.get(`/${fqon}/policies/${policyId}/rules?expand=true`).then((response) => {
      dispatch({ type: FETCH_POLICYRULES_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_POLICYRULES_REJECTED, payload: err });
    });
  };
}

export function fetchPolicyRule(fqon, policyId, ruleId) {
  return (dispatch) => {
    dispatch({ type: FETCH_POLICYRULE_PENDING });
    axios.get(`${fqon}/policies/${policyId}/rules/${ruleId}`).then((response) => {
      dispatch({ type: FETCH_POLICYRULE_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_POLICYRULE_REJECTED, payload: err });
    });
  };
}

export function createPolicyRule(fqon, policyId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_POLICYRULE_PENDING });
    axios.post(`${fqon}/policies/${policyId}/rules`, payload).then((response) => {
      dispatch({ type: CREATE_POLICYRULE_FULFILLED, payload: response.data });
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: CREATE_POLICYRULE_REJECTED, payload: err });
    });
  };
}

export function updatePolicyRule(fqon, policyId, ruleId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_POLICYRULE_PENDING });
    axios.patch(`${fqon}/policies/${policyId}/rules/${ruleId}`, patches).then((response) => {
      dispatch({ type: UPDATE_POLICYRULE_FULFILLED, payload: response.data });
      // dispatch(replace(`${fqon}/workspaces/${workspaceId}/environments/${policyId}`));
      dispatch(goBack());
    }).catch((err) => {
      dispatch({ type: UPDATE_POLICYRULE_REJECTED, payload: err });
    });
  };
}

export function deletePolicyRule(fqon, policyId, ruleId) {
  return (dispatch) => {
    dispatch({ type: DELETE_POLICYRULE_PENDING });
    axios.delete(`${fqon}/policies/${policyId}/rules/${ruleId}?force=true`).then(() => {
      dispatch({ type: DELETE_POLICYRULE_FULFILLED });
    }).catch((err) => {
      dispatch({ type: DELETE_POLICYRULE_REJECTED, payload: err });
    });
  };
}

export function deletePolicyRules(ruleIds, fqon, policyId) {
  return (dispatch) => {
    dispatch({ type: DELETE_POLICYRULE_PENDING });
    const all = ruleIds.map(id => axios.delete(`${fqon}/policies/${policyId}/rules/${id}?force=true`));

    axios.all(all).then(() => {
      dispatch({ type: DELETE_POLICYRULE_FULFILLED });
      dispatch(clearSelected());
      dispatch(fetchPolicyRules(fqon, policyId));
    }).catch((err) => {
      dispatch({ type: DELETE_POLICYRULE_REJECTED, payload: err });
      dispatch(clearSelected());
    });
  };
}

export function fetchLambdas(fqon, environmentId) {
  return (dispatch) => {
    dispatch({ type: FETCH_LAMBDAS_PENDING });
    axios.get(`/${fqon}/environments/${environmentId}/lambdas`).then((response) => {
      dispatch({ type: FETCH_LAMBDAS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_LAMBDAS_REJECTED, payload: err });
    });
  };
}

export function confirmDelete(action, multipleItems) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_MODAL',
      modalType: 'CONFIRM',
      modalProps: {
        title: 'Confirm Delete Policy Rules',
        multipleItems,
        onProceed: action,
      }
    });
  };
}
