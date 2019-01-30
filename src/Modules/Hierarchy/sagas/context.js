import { takeLatest, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import {
  PRE_CONTEXT_REQUEST,
  FETCH_CONTEXT_REQUEST,
  FETCH_CONTEXT_FULFILLED,
  FETCH_CONTEXT_REJECTED,
} from '../actionTypes';

import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';

export function* buildOrganizationPayload(action) {
  try {
    const [organization, organizations, workspaces, actions] = yield call(axios.all, [
      axios.get(action.fqon),
      axios.get(`${action.fqon}/orgs?expand=true`),
      axios.get(`${action.fqon}/workspaces?expand=true`),
      axios.get(`${action.fqon}/actions?expand=true&filter=context.nav`),
    ]);

    return yield put({
      type: FETCH_CONTEXT_FULFILLED,
      payload: {
        contextMeta: {
          context: 'organization',
          fqon: action.fqon,
        },
        organization: organization.data,
        organizations: organizations.data,
        workspaces: workspaces.data,
        actions: actions.data,
        // Clear the state here
        workspace: workspaceModel.get(),
        environment: environmentModel.get(),
        environments: [],
      },
    });
  } catch (e) {
    return yield put({ type: FETCH_CONTEXT_REJECTED, payload: e.message });
  }
}

export function* buildWorkspacePayload(action) {
  try {
    const { organization } = yield select(state => state.hierarchy.context);
    const contextMeta = {
      context: 'workspace',
      fqon: action.fqon,
      workspaceId: action.workspaceId,
    };

    // if there !organization.id then get the whole state tree up to the workspace context
    if (!organization.id) {
      const [org, organizations, workspaces, workspace, environments, actions] = yield call(axios.all, [
        axios.get(action.fqon),
        axios.get(`${action.fqon}/orgs?expand=true`),
        axios.get(`${action.fqon}/workspaces?expand=true`),
        axios.get(`${action.fqon}/workspaces/${action.workspaceId}`),
        axios.get(`${action.fqon}/workspaces/${action.workspaceId}/environments?expand=true`),
        axios.get(`${action.fqon}/workspaces/${action.workspaceId}/actions?expand=true&filter=context.nav`),
      ]);

      return yield put({
        type: FETCH_CONTEXT_FULFILLED,
        payload: {
          contextMeta,
          organization: org.data,
          organizations: organizations.data,
          workspaces: workspaces.data,
          workspace: workspace.data,
          environments: environments.data,
          actions: actions.data,
          // Clear the state here
          environment: environmentModel.get(),
        },
      });
    }

    const [workspace, environments, actions] = yield call(axios.all, [
      axios.get(`${action.fqon}/workspaces/${action.workspaceId}`),
      axios.get(`${action.fqon}/workspaces/${action.workspaceId}/environments?expand=true`),
      axios.get(`${action.fqon}/workspaces/${action.workspaceId}/actions?expand=true&filter=context.nav`),
    ]);

    return yield put({
      type: FETCH_CONTEXT_FULFILLED,
      payload: {
        contextMeta,
        workspace: workspace.data,
        environments: environments.data,
        actions: actions.data,
        // Clear the state here
        environment: environmentModel.get(),
      },
    });
  } catch (e) {
    return yield put({ type: FETCH_CONTEXT_REJECTED, payload: e.message });
  }
}

export function* buildEnvironmentPayload(action) {
  try {
    const { organization, workspace } = yield select(state => state.hierarchy.context);
    const contextMeta = {
      context: 'environment',
      fqon: action.fqon,
      workspaceId: action.workspaceId,
      environmentId: action.environmentId,
    };

    let envResponse;
    let actionsResponse;
    // If a workspace or org is not found then retrieve the environment first and get its parent id
    if (!workspace.id || !organization.id) {
      envResponse = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}`);
      actionsResponse = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}/actions?expand=true&filter=context.nav`);
    }

    if (!workspace.id) {
      const { properties } = envResponse.data;
      const promises = [
        axios.get(`${action.fqon}/workspaces/${properties.workspace.id}`),
        axios.get(`${action.fqon}/workspaces/${properties.workspace.id}/environments?expand=true`),
      ];

      // if there is a missing organization then get that too
      if (!organization.id) {
        promises.push(...[
          axios.get(action.fqon),
          axios.get(`${action.fqon}/orgs?expand=true`),
          axios.get(`${action.fqon}/workspaces?expand=true`),
        ]);

        const [wkspc, envs, org, orgs, wkspcs] = yield call(axios.all, promises);

        return yield put({
          type: FETCH_CONTEXT_FULFILLED,
          payload: {
            contextMeta,
            environment: envResponse.data,
            workspace: wkspc.data,
            environments: envs.data,
            organization: org.data,
            organizations: orgs.data,
            workspaces: wkspcs.data,
            actions: actionsResponse.data,
          },
        });
      }

      const [wkspc, environments] = yield call(axios.all, promises);

      return yield put({
        type: FETCH_CONTEXT_FULFILLED,
        payload: {
          contextMeta,
          environment: envResponse.data,
          workspace: wkspc.data,
          environments: environments.data,
          actions: actionsResponse.data,
        },
      });
    }

    // Just get the environment context
    const [env, actions] = yield call(axios.all, [
      axios.get(`${action.fqon}/environments/${action.environmentId}`),
      axios.get(`${action.fqon}/environments/${action.environmentId}/actions?expand=true&filter=context.nav`),
    ]);

    return yield put({
      type: FETCH_CONTEXT_FULFILLED,
      payload: {
        contextMeta,
        environment: env.data,
        actions: actions.data,
      },
    });
  } catch (e) {
    return yield put({ type: FETCH_CONTEXT_REJECTED, payload: e.message });
  }
}

/**
 * fetchContext
 * @param {*} action - { fqon, id, context }
 */
export function* fetchContext(action) {
  yield put({
    type: PRE_CONTEXT_REQUEST,
    payload: {
      contextMeta: {
        context: action.context || 'organization',
        fqon: action.fqon,
        workspaceId: action.workspaceId,
        environmentId: action.environmentId,
      },
    },
  });

  if (action.context === 'workspace') {
    return yield call(buildWorkspacePayload, action);
  }

  if (action.context === 'environment') {
    return yield call(buildEnvironmentPayload, action);
  }

  return yield call(buildOrganizationPayload, action);
}

// Watchers
export default function* () {
  yield takeLatest(FETCH_CONTEXT_REQUEST, fetchContext);
}
