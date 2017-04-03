import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import entitlementSagas, {
  fetchEntitlements,
  fetchIdentities,
  updateEntitlements,
} from './entitlements';
import * as types from '../actionTypes';

describe('API Sagas', () => {
  const error = 'an error has occured';

  describe('fetchEntitlements Sequence', () => {
    let result;

    describe('fetchEntitlements with an entityId/entityKey when the identity matches', () => {
      const saga = fetchEntitlements({
        fqon: 'iamfqon', entityId: '1', entityKey: 'environments', selectedIdentity: { id: 1 }
      });

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/entitlements?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        const entitlementMock = { id: 1, properties: { action: 'workspace.create', identities: [{ id: 1 }] } };

        result = saga.next({ data: [entitlementMock] });

        const expectedPayload = [
          {
            type: 'workspace',
            actions: [{
              key: 'workspace.create',
              action: 'create',
              entitlement: entitlementMock,
              identities: [{ id: 1 }],
              toggled: true,
            }],
            toggled: true,
          },
        ];

        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });

      it('should update SELECTED_IDENTITY', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.SELECTED_IDENTITY, payload: { id: 1 } })
        );
      });
    });

    describe('fetchEntitlements with an entityId/entityKey when identity DOES NOT match', () => {
      const saga = fetchEntitlements({
        fqon: 'iamfqon', entityId: '1', entityKey: 'environments', selectedIdentity: { id: 42 }
      });

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/environments/1/entitlements?expand=true')
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

        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });

      it('should update SELECTED_IDENTITY', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.SELECTED_IDENTITY, payload: { id: 42 } })
        );
      });
    });

    describe('fetchEntitlements without an entityId/entityKey', () => {
      const saga = fetchEntitlements({ fqon: 'iamfqon', selectedIdentity: { id: 1 } });
      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/entitlements?expand=true')
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

        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_ENTITLEMENTS_FULFILLED, payload: expectedPayload })
        );
      });

      it('should update SELECTED_IDENTITY', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.SELECTED_IDENTITY, payload: { id: 1 } })
        );
      });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchEntitlements({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_ENTITLEMENTS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchIdentities Sequence', () => {
    const saga = fetchIdentities({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.get('iamfqon/users'), axios.get('iamfqon/groups')])
      );
    });

    it('should return a sorted and combined payload and dispatch a success status', () => {
      result = saga.next([{ data: [{ id: 2, name: 'apple' }] }, { data: [{ id: 1, name: 'zebra' }] }]);
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_IDENTITIES_FULFILLED, payload: [{ id: 2, name: 'apple' }, { id: 1, name: 'zebra' }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchIdentities({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_IDENTITIES_REJECTED, payload: error })
      );
    });
  });

  // TODO: Finish Tests - this may all change COMPLETELY in the api so keeping tests minimal for now
  describe('updateEntitlements Sequence ', () => {
    describe('updateEntitlements with an entityId/entityKey and no actions', () => {
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentity: '42', actions: [], entityId: '1', entityKey: 'environments' });
      let result;

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements with an entityId/entityKey and there are actions and toggled is true', () => {
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
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentity: '42', actions, entityId: '1', entityKey: 'environments' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.all, [axios.put('iamfqon/entitlements/42')])
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements with an entityId/entityKey and there are actions and toggled is true', () => {
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
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentity: '42', actions, entityId: '1', entityKey: 'environments' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.all, [axios.put('iamfqon/entitlements/42')])
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('updateEntitlements with an entityId/entityKey and there are actions and toggled is false', () => {
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
      const saga = updateEntitlements({ fqon: 'iamfqon', newIdentity: '42', actions, entityId: '1', entityKey: 'environments' });
      let result;

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          put({ type: types.UPDATE_ENTITLEMENT_FULFILLED })
        );
      });
    });

    describe('when updateEntitlements is valud and we pass the onSuccess callback', () => {
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

      const onSuccessAction = { fqon: 'iamfqon', newIdentity: '42', actions, entityId: '1', entityKey: 'environments', onSuccess: sinon.stub() };
      const saga = updateEntitlements(onSuccessAction);
      saga.next();
      saga.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateEntitlements({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_ENTITLEMENT_REJECTED, payload: error })
      );
    });
  });

  describe('entitlementSagas', () => {
    let result;
    const rootSaga = entitlementSagas();

    it('should fork a watcher for fetchEntitlements', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_ENTITLEMENTS_REQUEST, fetchEntitlements)
      );
    });

    it('should fork a watcher for fetchIdentities', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_IDENTITIES_REQUEST, fetchIdentities)
      );
    });

    it('should fork a watcher for updateEntitlements', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_ENTITLEMENT_REQUEST, updateEntitlements)
      );
    });
  });
});
