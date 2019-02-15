import axios from 'axios';
import { fetchAPI } from 'config/lib/utility';
import { call, put, takeLatest } from 'redux-saga/effects';
import entitlementSagas, {
  fetchEntitlements,
  updateEntitlements,
} from './entitlements';
import {
  FETCH_ENTITLEMENTS_REQUEST,
  FETCH_ENTITLEMENTS_FULFILLED,
  FETCH_ENTITLEMENTS_REJECTED,
  UPDATE_ENTITLEMENT_FULFILLED,
  UPDATE_ENTITLEMENT_REJECTED,
  UPDATE_ENTITLEMENT_REQUEST,
} from '../actionTypes';

describe('Entitlement Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEntitlements Sequence', () => {
    let result;

    describe('fetchEntitlements with an entityId/entityKey when the identity matches', () => {
      const saga = fetchEntitlements({
        fqon: 'iamfqon', entityId: '1', entityKey: 'environments', identityId: '2',
      });

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/environments/1/entitlements?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [{ id: '2' }] } };

        result = saga.next({ data: [entitlementMock] });

        const expectedPayload = [
          {
            type: 'workspace',
            actions: [{
              key: 'workspace.create',
              action: 'create',
              entitlement: entitlementMock,
              identities: [{ id: '2' }],
              toggled: true,
            }],
            toggled: true,
          },
        ];

        expect(result.value).toEqual(
          put({ type: FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });
    });

    describe('fetchEntitlements with an entityId/entityKey when identity DOES NOT match', () => {
      const saga = fetchEntitlements({
        fqon: 'iamfqon', entityId: '1', entityKey: 'environments', identityId: { id: 42 }
      });

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/environments/1/entitlements?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [] } };

        result = saga.next({ data: [entitlementMock] });

        const expectedPayload = [
          {
            type: 'workspace',
            actions: [{
              key: 'workspace.create',
              action: 'create',
              entitlement: entitlementMock,
              identities: [],
              toggled: false,
            }],
            toggled: false,
          },
        ];

        expect(result.value).toEqual(
          put({ type: FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });
    });

    describe('fetchEntitlements without an entityId/entityKey', () => {
      const saga = fetchEntitlements({ fqon: 'iamfqon', identityId: { id: 1 } });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'iamfqon/entitlements?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [] } };

        result = saga.next({ data: [entitlementMock] });

        const expectedPayload = [
          {
            type: 'workspace',
            actions: [{
              key: 'workspace.create',
              action: 'create',
              entitlement: entitlementMock,
              identities: [],
              toggled: false,
            }],
            toggled: false,
          },
        ];

        expect(result.value).toEqual(
          put({ type: FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEntitlements({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_ENTITLEMENTS_REJECTED, payload: error })
      );
    });
  });

  // TODO: Finish Tests - this may all change COMPLETELY in the api so keeping tests minimal for now
  describe('updateEntitlements Sequence ', () => {
    describe('updateEntitlements with no actions', () => {
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentityId: '42', actions: [] });
      let result;

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({ type: UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements when there are actions and toggled is true', () => {
      const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [{ id: 1 }] } };
      const actions = [
        {
          key: 'workspace.create',
          action: 'create',
          entitlement: entitlementMock,
          identities: [],
          toggled: true,
        }
      ];
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentityId: '42', actions });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.all, [axios.put('iamfqon/entitlements/42')])
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({ type: UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements when there are actions and toggled is true', () => {
      const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [{ id: 42 }] } };
      const actions = [
        {
          key: 'workspace.create',
          action: 'create',
          entitlement: entitlementMock,
          identities: [{ id: 42 }],
          toggled: true,
        }
      ];
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentityId: '42', actions });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(axios.all, [axios.put('iamfqon/entitlements/42')])
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({ type: UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements when there are actions and toggled is false', () => {
      const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [{ id: 1 }] } };
      const actions = [
        {
          key: 'workspace.create',
          action: 'create',
          entitlement: entitlementMock,
          identities: [],
          toggled: false,
        }
      ];
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentityId: '42', actions });
      let result;

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({ type: UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('when updateEntitlements is valid and we pass the onSuccess callback', () => {
      const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [] } };
      const actions = [
        {
          key: 'workspace.create',
          action: 'create',
          entitlement: entitlementMock,
          identities: [],
          toggled: true,
        }
      ];

      const onSuccessAction = { fqon: 'iamfqon', newIdentityId: '42', actions, onSuccess: jest.fn() };
      const saga = updateEntitlements(onSuccessAction);
      saga.next();
      saga.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).toBeCalled();
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateEntitlements({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: UPDATE_ENTITLEMENT_REJECTED, payload: error })
      );
    });
  });

  describe('entitlementSagas', () => {
    let result;
    const rootSaga = entitlementSagas();

    it('should fork a watcher for fetchEntitlements', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(FETCH_ENTITLEMENTS_REQUEST, fetchEntitlements)
      );
    });

    it('should fork a watcher for updateEntitlements', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(UPDATE_ENTITLEMENT_REQUEST, updateEntitlements)
      );
    });
  });
});
