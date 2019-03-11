import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import contextSagas, {
  fetchContext,
  buildOrganizationPayload,
  buildWorkspacePayload,
  buildEnvironmentPayload,
} from './context';

import {
  PRE_CONTEXT_REQUEST,
  FETCH_CONTEXT_REQUEST,
  FETCH_CONTEXT_FULFILLED,
  FETCH_CONTEXT_REJECTED,
} from '../actionTypes';

import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';

describe('Context Workflow Sagas', () => {
  describe('buildOrganizationPayload for Organization Sequence', () => {
    const saga = buildOrganizationPayload({ fqon: 'test' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.all, [
          axios.get('test'),
          axios.get('test/orgs?expand=true'),
          axios.get('test/workspaces?expand=true'),
          axios.get('test/actions?expand=true&filter=context.nav'),
        ])
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next([
        { data: { id: 1, name: 'org context' } },
        { data: [{ id: 2, name: 'sub org' }] },
        { data: [{ id: 3, name: 'workspace' }] },
        { data: [{ id: 3333, display_name: 'an action' }] },
      ]);

      expect(result.value).toEqual(
        put({
          type: FETCH_CONTEXT_FULFILLED,
          payload: {
            contextMeta: {
              context: 'organization',
              fqon: 'test',
              baseHref: 'test',
            },
            organization: { id: 1, name: 'org context' },
            organizations: [{ id: 2, name: 'sub org' }],
            workspaces: [{ id: 3, name: 'workspace' }],
            actions: [{ id: 3333, display_name: 'an action' }],
            workspace: workspaceModel.get(),
            environment: environmentModel.get(),
            environments: [],
          },
        })
      );
    });
  });

  describe('buildWorkspacePayload for Organization Sequence', () => {
    describe('when there is an existing organization in state', () => {
      const saga = buildWorkspacePayload({ fqon: 'test', workspaceId: '123', context: 'workspace' });
      let result;

      it('should make an api call', () => {
        result = saga.next();

        result = saga.next({ organization: { id: 'hazId' } }); // mock select
        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/workspaces/123'),
            axios.get('test/workspaces/123/environments?expand=true'),
            axios.get('test/workspaces/123/actions?expand=true&filter=context.nav'),
          ])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: { id: 1, name: 'workspace' } },
          { data: [{ id: 2, name: 'environment' }] },
          { data: [{ id: 3333, display_name: 'an action' }] },
        ]);

        expect(result.value).toEqual(
          put({
            type: FETCH_CONTEXT_FULFILLED,
            payload: {
              contextMeta: {
                context: 'workspace',
                fqon: 'test',
                workspaceId: '123',
                baseHref: 'test/workspaces/123',
              },
              workspace: { id: 1, name: 'workspace' },
              environments: [{ id: 2, name: 'environment' }],
              actions: [{ id: 3333, display_name: 'an action' }],
              environment: environmentModel.get(),
            },
          })
        );
      });
    });

    describe('when there no organization in state', () => {
      const saga = buildWorkspacePayload({ fqon: 'test', workspaceId: '123', context: 'workspace' });
      let result;

      it('should make an api call to get the rollup', () => {
        result = saga.next();
        result = saga.next({ organization: { } }); // mock select
        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test'),
            axios.get('test/orgs?expand=true'),
            axios.get('test/workspaces?expand=true'),
            axios.get('test/workspaces/123'),
            axios.get('test/workspaces/123/environments?expand=true'),
            axios.get('test/workspaces/123/actions?expand=true&filter=context.nav'),
          ])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: { id: 1, name: 'org context' } },
          { data: [{ id: 2, name: 'sub org' }] },
          { data: [{ id: 3, name: 'workspace' }] },
          { data: { id: 3, name: 'workspace root' } },
          { data: [{ id: 3, name: 'an environment' }] },
          { data: [{ id: 3333, display_name: 'an action' }] },
        ]);

        expect(result.value).toEqual(
          put({
            type: FETCH_CONTEXT_FULFILLED,
            payload: {
              contextMeta: {
                context: 'workspace',
                fqon: 'test',
                workspaceId: '123',
                baseHref: 'test/workspaces/123',
              },
              organization: { id: 1, name: 'org context' },
              organizations: [{ id: 2, name: 'sub org' }],
              workspaces: [{ id: 3, name: 'workspace' }],
              workspace: { id: 3, name: 'workspace root' },
              environments: [{ id: 3, name: 'an environment' }],
              actions: [{ id: 3333, display_name: 'an action' }],
              environment: environmentModel.get(),
            },
          })
        );
      });
    });
  });


  describe('buildEnvironmentPayload for Organization Sequence', () => {
    describe('when there is an existing organization and workspace in state', () => {
      const saga = buildEnvironmentPayload({ fqon: 'test', workspaceId: '567', environmentId: '123', context: 'environment' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        result = saga.next({ organization: { id: 'hazId' }, workspace: { id: 'hazzzzId' } }); // mock select
        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/environments/123'),
            axios.get('test/environments/123/actions?expand=true&filter=context.nav'),
          ])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: { id: 1, name: 'environment' } },
          { data: [{ id: 3333, display_name: 'an action' }] },
        ]);

        expect(result.value).toEqual(
          put({
            type: FETCH_CONTEXT_FULFILLED,
            payload: {
              contextMeta: {
                context: 'environment',
                fqon: 'test',
                workspaceId: '567',
                environmentId: '123',
                baseHref: 'test/environments/123',
              },
              environment: { id: 1, name: 'environment' },
              actions: [{ id: 3333, display_name: 'an action' }],
            },
          })
        );
      });
    });

    describe('when there is no workspace state, but there is an organization state', () => {
      const saga = buildEnvironmentPayload({ fqon: 'test', workspaceId: '567', environmentId: '123', context: 'environment' });
      let result;

      it('should make an api call to retrieve the environment', () => {
        result = saga.next();
        result = saga.next({ organization: { id: 'hazId' }, workspace: { } }); // mock select
        expect(result.value).toEqual(
          call(axios.get, 'test/environments/123'),
        );
      });

      it('should make an api call to retrieve the environment Actions', () => {
        result = saga.next({ data: { id: '456', properties: { workspace: { id: '890' } } } }); // environment Response
        expect(result.value).toEqual(
          call(axios.get, 'test/environments/123/actions?expand=true&filter=context.nav'),
        );
      });

      it('should make an api call for a context rollup', () => {
        result = saga.next({ data: [{ id: 3333, display_name: 'an action' }] }); // actions Response

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/workspaces/890'),
            axios.get('test/workspaces/890/environments?expand=true'),
          ])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: { id: 2, name: 'workspace context' } },
          { data: [{ id: 3, name: 'an environment' }] },
        ]);

        expect(result.value).toEqual(
          put({
            type: FETCH_CONTEXT_FULFILLED,
            payload: {
              contextMeta: {
                context: 'environment',
                fqon: 'test',
                workspaceId: '567',
                environmentId: '123',
                baseHref: 'test/environments/123',
              },
              environment: { id: '456', properties: { workspace: { id: '890' } } },
              workspace: { id: 2, name: 'workspace context' },
              environments: [{ id: 3, name: 'an environment' }],
              actions: [{ id: 3333, display_name: 'an action' }],
            },
          })
        );
      });
    });

    describe('when there is no workspace state and no organization state', () => {
      const saga = buildEnvironmentPayload({ fqon: 'test', workspaceId: '567', environmentId: '123', context: 'environment' });
      let result;

      it('should make an api call to retrieve the environment', () => {
        result = saga.next();
        result = saga.next({ organization: {}, workspace: {} }); // mock select

        expect(result.value).toEqual(
          call(axios.get, 'test/environments/123'),
        );
      });

      it('should make an api call to retrieve the environment Actions', () => {
        result = saga.next({ data: { id: '456', properties: { workspace: { id: '890' } } } }); // environment Response
        expect(result.value).toEqual(
          call(axios.get, 'test/environments/123/actions?expand=true&filter=context.nav'),
        );
      });

      it('should make an api call for a context rollup', () => {
        result = saga.next({ data: [{ id: 3333, display_name: 'an action' }] }); // actions Response

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/workspaces/890'),
            axios.get('test/workspaces/890/environments?expand=true'),
            axios.get('test'),
            axios.get('test/orgs?expand=true'),
            axios.get('test/workspaces?expand=true'),
          ])
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: { id: 2, name: 'workspace context' } },
          { data: [{ id: 3, name: 'an environment' }] },
          { data: { id: 4, name: 'an org context' } },
          { data: [{ id: 5, name: 'sub org' }] },
          { data: [{ id: 6, name: 'a workspace' }] },
          { data: [{ id: 3333, display_name: 'an action' }] },
        ]);

        expect(result.value).toEqual(
          put({
            type: FETCH_CONTEXT_FULFILLED,
            payload: {
              contextMeta: {
                context: 'environment',
                fqon: 'test',
                workspaceId: '567',
                environmentId: '123',
                baseHref: 'test/environments/123',
              },
              environment: { id: '456', properties: { workspace: { id: '890' } } },
              workspace: { id: 2, name: 'workspace context' },
              environments: [{ id: 3, name: 'an environment' }],
              organization: { id: 4, name: 'an org context' },
              organizations: [{ id: 5, name: 'sub org' }],
              workspaces: [{ id: 6, name: 'a workspace' }],
              actions: [{ id: 3333, display_name: 'an action' }],
            },
          })
        );
      });
    });
  });

  describe('fetchContext as organization when context is not oneOf(workspace, environment)', () => {
    const saga = fetchContext({ fqon: 'test' });
    let result;

    it('should preset the context', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({
          type: PRE_CONTEXT_REQUEST,
          payload: {
            contextMeta: {
              context: 'organization',
              fqon: 'test',
              baseHref: 'test',
            },
          },
        }),
      );
    });

    it('should call buildOrganizationPayload', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(buildOrganizationPayload, {
          fqon: 'test',
        }),
      );
    });
  });

  describe('fetchContext when context for a workspace is requested ', () => {
    const saga = fetchContext({ fqon: 'test', workspaceId: '123', context: 'workspace' });
    let result;

    it('should preset the context', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({
          type: PRE_CONTEXT_REQUEST,
          payload: {
            contextMeta: {
              context: 'workspace',
              fqon: 'test',
              workspaceId: '123',
              environmentId: undefined,
              baseHref: 'test/workspaces/123',
            },
          },
        }),
      );
    });


    it('should call buildWorkspacePayload', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(buildWorkspacePayload, {
          context: 'workspace',
          fqon: 'test',
          workspaceId: '123',
        }),
      );
    });
  });

  describe('fetchContext when context for an environment is requested', () => {
    const saga = fetchContext({ fqon: 'test', workspaceId: '567', environmentId: '123', context: 'environment' });
    let result;

    it('should preset the context', () => {
      result = saga.next();
      expect(result.value).toEqual(
        put({
          type: PRE_CONTEXT_REQUEST,
          payload: {
            contextMeta: {
              context: 'environment',
              fqon: 'test',
              workspaceId: '567',
              environmentId: '123',
              baseHref: 'test/environments/123',
            },
          },
        }),
      );
    });

    it('should call buildEnvironmentPayload', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(buildEnvironmentPayload, {
          context: 'environment',
          fqon: 'test',
          workspaceId: '567',
          environmentId: '123',
        }),
      );
    });
  });

  describe('when there is an exception calling buildOrganizationPayload', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const error = 'an error has occured';
      const sagaError = buildOrganizationPayload({ fqon: 'test' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('when there is an exception calling buildWorkspacePayload', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const error = 'an error has occured';
      const sagaError = buildWorkspacePayload({ fqon: 'test', workspaceId: '123', context: 'workspace' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('when there is an exception calling buildEnvironmentPayload', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const error = 'an error has occured';
      const sagaError = buildEnvironmentPayload({ fqon: 'test', workspaceId: '567', environmentId: '123', context: 'environment' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_CONTEXT_REJECTED, payload: error })
      );
    });
  });

  describe('contextSagas', () => {
    let result;
    const rootSaga = contextSagas();

    it('should fork a watcher for fetchContext', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_CONTEXT_REQUEST, fetchContext)
      );
    });
  });
});
