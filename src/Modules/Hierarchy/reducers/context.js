import { insertItem, removeItem, updateItem } from 'util/helpers/lists';
import {
  PRE_CONTEXT_REQUEST,
  FETCH_CONTEXT_REQUEST,
  FETCH_CONTEXT_FULFILLED,
  FETCH_CONTEXT_REJECTED,
  UNLOAD_CONTEXT,
  CREATE_ORG_FULFILLED,
  UPDATE_ORG_FULFILLED,
  DELETE_ORG_FULFILLED,
  CREATE_WORKSPACE_FULFILLED,
  UPDATE_WORKSPACE_FULFILLED,
  DELETE_WORKSPACE_FULFILLED,
  CREATE_ENVIRONMENT_FULFILLED,
  UPDATE_ENVIRONMENT_FULFILLED,
  DELETE_ENVIRONMENT_FULFILLED,
} from '../actionTypes';

import organizationModel from '../models/organization';
import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';

const initialState = {
  contextMeta: {
    context: null,
    fqon: null,
    workspaceId: null,
    environmentId: null,
    baseHref: null,
  },
  organization: organizationModel.get(),
  organizations: [],
  workspace: workspaceModel.get(),
  workspaces: [],
  environment: environmentModel.get(),
  environments: [],
  actions: [],
  pending: false,
  completed: false,
};

export default (state = initialState, action) => {
  // Context mgmt
  switch (action.type) {
    case PRE_CONTEXT_REQUEST:
      return {
        ...state,
        contextMeta: action.payload.contextMeta,
        actions: [],
      };
    case FETCH_CONTEXT_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_CONTEXT_FULFILLED:
      return {
        ...state,
        ...action.payload,
        pending: false,
        completed: true,
      };
    case FETCH_CONTEXT_REJECTED:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };

    // Organization Mgmt to keep context in sync with context changes
    case CREATE_ORG_FULFILLED:
      return {
        ...state,
        organizations: insertItem(state.organizations, action.payload),
      };
    case UPDATE_ORG_FULFILLED:
      // if the org context is different
      if (action.payload.id !== state.organization.id) {
        return {
          ...state,
          organizations: updateItem(state.organizations, action.payload),
        };
      }

      return {
        ...state,
        organization: action.payload,
      };
    case DELETE_ORG_FULFILLED:
      return {
        ...state,
        organizations: removeItem(state.organizations, action.payload),
      };

    // Workspace Mgmt to keep context in sync with context changes
    case CREATE_WORKSPACE_FULFILLED:
      return {
        ...state,
        workspaces: insertItem(state.workspaces, action.payload),
      };
    case UPDATE_WORKSPACE_FULFILLED:
      // if the workspace context is different
      if (action.payload.id !== state.workspace.id) {
        return {
          ...state,
          workspaces: updateItem(state.workspaces, action.payload),
        };
      }

      return {
        ...state,
        workspace: action.payload,
      };
    case DELETE_WORKSPACE_FULFILLED:
      return {
        ...state,
        workspaces: removeItem(state.workspaces, action.payload),
      };

    // Environment Mgmt to keep context in sync with context changes
    case CREATE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        environments: insertItem(state.environments, action.payload),
      };
    case UPDATE_ENVIRONMENT_FULFILLED:
      // if the environment context is different
      if (action.payload.id !== state.environment.id) {
        return {
          ...state,
          environments: updateItem(state.environments, action.payload),
        };
      }

      return {
        ...state,
        environment: action.payload,
      };
    case DELETE_ENVIRONMENT_FULFILLED:
      return {
        ...state,
        environments: removeItem(state.environments, action.payload),
      };

    case UNLOAD_CONTEXT:
      if (action.context === 'switch-context-from-environment') {
        return {
          ...state,
          environment: environmentModel.get(),
          environments: [],
        };
      }

      // Any other cases where we need to clear the context from the view layer

      return initialState;
    default:
      return state;
  }
};
