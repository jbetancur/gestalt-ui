import {
  UNLOAD_CURRENT_WORKSPACE_CONTEXT,
  UNLOAD_CURRENT_ENVIRONMENT_CONTEXT,
} from './actionTypes';

export function unloadWorkspaceContext() {
  return { type: UNLOAD_CURRENT_WORKSPACE_CONTEXT };
}

export function unloadEnvironmentContext() {
  return { type: UNLOAD_CURRENT_ENVIRONMENT_CONTEXT };
}

export default {
  unloadWorkspaceContext,
  unloadEnvironmentContext,
};
