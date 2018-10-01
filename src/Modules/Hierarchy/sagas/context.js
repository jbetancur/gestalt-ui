import { takeLatest, put, call, fork, select } from 'redux-saga/effects';
import axios from 'axios';
import {
  PRE_CONTEXT_REQUEST,
  FETCH_CONTEXT_REQUEST,
  FETCH_CONTEXT_FULFILLED,
  FETCH_CONTEXT_REJECTED,
} from '../constants';

import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';

export function* buildOrganizationPayload(action) {
  try {
    const [organization, organizations, workspaces] = yield call(axios.all, [
      axios.get(action.fqon),
      axios.get(`${action.fqon}/orgs?expand=true`),
      axios.get(`${action.fqon}/workspaces?expand=true`),
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
        // Clear the state here
        workspace: workspaceModel.get(),
        environment: environmentModel.get(),
        environments: []
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
      const [org, organizations, workspaces, workspace, environments] = yield call(axios.all, [
        axios.get(action.fqon),
        axios.get(`${action.fqon}/orgs?expand=true`),
        axios.get(`${action.fqon}/workspaces?expand=true`),
        axios.get(`${action.fqon}/workspaces/${action.workspaceId}`),
        axios.get(`${action.fqon}/workspaces/${action.workspaceId}/environments?expand=true`),
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
          // Clear the state here
          environment: environmentModel.get(),
        },
      });
    }

    const [workspace, environments] = yield call(axios.all, [
      axios.get(`${action.fqon}/workspaces/${action.workspaceId}`),
      axios.get(`${action.fqon}/workspaces/${action.workspaceId}/environments?expand=true`),
    ]);

    return yield put({
      type: FETCH_CONTEXT_FULFILLED,
      payload: {
        contextMeta,
        workspace: workspace.data,
        environments: environments.data,
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

    if (!workspace.id) {
      // If a workspace is not found then retrieve the environment first and get its parent id
      const { data } = yield call(axios.get, `${action.fqon}/environments/${action.environmentId}`);

      const { properties } = data;
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
            environment: data,
            workspace: wkspc.data,
            environments: envs.data,
            organization: org.data,
            organizations: orgs.data,
            workspaces: wkspcs.data,
          },
        });
      }

      const [wkspc, environments] = yield call(axios.all, promises);

      return yield put({
        type: FETCH_CONTEXT_FULFILLED,
        payload: {
          contextMeta,
          environment: data,
          workspace: wkspc.data,
          environments: environments.data,
        },
      });
    }

    // Just get the environment context
    const [env] = yield call(axios.all, [
      axios.get(`${action.fqon}/environments/${action.environmentId}`),
    ]);

    return yield put({
      type: FETCH_CONTEXT_FULFILLED,
      payload: {
        contextMeta,
        environment: env.data,
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
  yield fork(takeLatest, FETCH_CONTEXT_REQUEST, fetchContext);
}
