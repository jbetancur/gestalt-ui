import {
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
import reducer from './context';

const initialState = {
  contextMeta: {
    context: null,
    fqon: null,
    workspaceId: null,
    environmentId: null,
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

describe('context reducer', () => {
  describe('when managing context states', () => {
    it('should return the initial state', () => {
      expect(
        reducer(undefined, {})
      ).toEqual(initialState);
    });

    it('should handle FETCH_CONTEXT_REQUEST', () => {
      expect(
        reducer({}, {
          type: FETCH_CONTEXT_REQUEST,
        })
      ).toEqual({
        pending: true,
      });
    });

    it('should handle FETCH_CONTEXT_FULFILLED', () => {
      expect(
        reducer({}, {
          type: FETCH_CONTEXT_FULFILLED,
          payload: { test: 'test' },
        })
      ).toEqual({
        test: 'test',
        pending: false,
        completed: true,
      });
    });

    it('should handle FETCH_CONTEXT_REJECTED', () => {
      expect(
        reducer({}, {
          type: FETCH_CONTEXT_REJECTED,
          payload: { test: 'test' },
        })
      ).toEqual({
        error: { test: 'test' },
        pending: false,
      });
    });
  });

  describe('when keeping org synced with context', () => {
    it('should handle CREATE_ORG_FULFILLED', () => {
      expect(
        reducer({ organizations: [] }, {
          type: CREATE_ORG_FULFILLED,
          payload: { id: '123' },
        })
      ).toEqual({
        organizations: [{ id: '123' }],
      });
    });

    it('should handle UPDATE_ORG_FULFILLED when updating from a drilled in state. e.g. the org context and the payload have different ids', () => {
      expect(
        reducer({ organizations: [{ id: '123', name: 'rick' }], organization: { id: '321', name: 'gazorazorp' } }, {
          type: UPDATE_ORG_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        organization: { id: '321', name: 'gazorazorp' },
        organizations: [{ id: '123', name: 'morty' }],
      });
    });

    it('should handle UPDATE_ORG_FULFILLED when the org context when the ids are the same', () => {
      expect(
        reducer({ organization: { id: '123', name: 'rick' } }, {
          type: UPDATE_ORG_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        organization: { id: '123', name: 'morty' },
      });
    });

    it('should handle DELETE_ORG_FULFILLED', () => {
      expect(
        reducer({ organizations: [{ id: '123', name: 'rick' }] }, {
          type: DELETE_ORG_FULFILLED,
        })
      ).toEqual({
        organizations: [],
      });
    });
  });

  describe('when keeping workspace synced with context', () => {
    it('should handle CREATE_WORKSPACE_FULFILLED', () => {
      expect(
        reducer({ workspaces: [] }, {
          type: CREATE_WORKSPACE_FULFILLED,
          payload: { id: '123' },
        })
      ).toEqual({
        workspaces: [{ id: '123' }],
      });
    });

    it('should handle UPDATE_WORKSPACE_FULFILLED when updating from a drilled in state. e.g. the workspace context and the payload have different ids', () => {
      expect(
        reducer({ workspaces: [{ id: '123', name: 'rick' }], workspace: { id: '321', name: 'gazorazorp' } }, {
          type: UPDATE_WORKSPACE_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        workspace: { id: '321', name: 'gazorazorp' },
        workspaces: [{ id: '123', name: 'morty' }],
      });
    });

    it('should handle UPDATE_WORKSPACE_FULFILLED when the org context when the ids are the same', () => {
      expect(
        reducer({ workspace: { id: '123', name: 'rick' } }, {
          type: UPDATE_WORKSPACE_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        workspace: { id: '123', name: 'morty' },
      });
    });

    it('should handle DELETE_WORKSPACE_FULFILLED', () => {
      expect(
        reducer({ workspaces: [{ id: '123', name: 'rick' }] }, {
          type: DELETE_WORKSPACE_FULFILLED,
        })
      ).toEqual({
        workspaces: [],
      });
    });
  });

  describe('when keeping environment synced with context', () => {
    it('should handle CREATE_ENVIRONMENT_FULFILLED', () => {
      expect(
        reducer({ environments: [] }, {
          type: CREATE_ENVIRONMENT_FULFILLED,
          payload: { id: '123' },
        })
      ).toEqual({
        environments: [{ id: '123' }],
      });
    });

    it('should handle UPDATE_ENVIRONMENT_FULFILLED when updating from a drilled in state. e.g. the workspace context and the payload have different ids', () => {
      expect(
        reducer({ environments: [{ id: '123', name: 'rick' }], environment: { id: '321', name: 'gazorazorp' } }, {
          type: UPDATE_ENVIRONMENT_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        environment: { id: '321', name: 'gazorazorp' },
        environments: [{ id: '123', name: 'morty' }],
      });
    });

    it('should handle UPDATE_ENVIRONMENT_FULFILLED when the org context when the ids are the same', () => {
      expect(
        reducer({ environment: { id: '123', name: 'rick' } }, {
          type: UPDATE_ENVIRONMENT_FULFILLED,
          payload: { id: '123', name: 'morty' },
        })
      ).toEqual({
        environment: { id: '123', name: 'morty' },
      });
    });

    it('should handle DELETE_ENVIRONMENT_FULFILLED', () => {
      expect(
        reducer({ environments: [{ id: '123', name: 'rick' }] }, {
          type: DELETE_ENVIRONMENT_FULFILLED,
        })
      ).toEqual({
        environments: [],
      });
    });

    it('should handle UNLOAD_CONTEXT when switch-context-from-environment is passsed as context', () => {
      expect(
        reducer({ environment: { id: '321' }, environments: [{ id: '123', name: 'rick' }] }, {
          type: UNLOAD_CONTEXT,
          context: 'switch-context-from-environment',
        })
      ).toEqual({
        environment: environmentModel.get(),
        environments: [],
      });
    });

    it('should remove all context when UNLOAD_CONTEXT and no context ()', () => {
      expect(
        reducer({ environment: { id: '321' }, environments: [{ id: '123', name: 'rick' }] }, {
          type: UNLOAD_CONTEXT,
        })
      ).toEqual(initialState);
    });
  });
});
