import {
  FETCH_UPGRADEAVAILABLE_REQUEST,
  FETCH_UPGRADEAVAILABLE_FULFILLED,
  FETCH_UPGRADEAVAILABLE_REJECTED,
  CLOSE_UPGRADEAVAILBALE,
} from '../constants';

import reducer from './upgrader';

const initialState = {
  status: {
    upgradeAvailable: false,
    upgradeImage: '',
    upgradeNotes: '',
    severity: '',
  },
  pending: false,
  completed: false,
};

const mockPayload = {
  upgradeAvailable: true,
  upgradeImage: 'gcr.io/galactic-public-2018/upgradeFrom2.4.1TO2.4.2',
  upgradeNotes: 'http://docs.galacticfog.com/docs/patchnotes2.4.2.html',
  severity: 'recommended',
};

describe('context reducer', () => {
  describe('when managing context states', () => {
    it('should return the initial state', () => {
      expect(
        reducer(undefined, {})
      ).toEqual(initialState);
    });

    it('should handle FETCH_UPGRADEAVAILABLE_REQUEST', () => {
      expect(
        reducer({}, {
          type: FETCH_UPGRADEAVAILABLE_REQUEST,
        })
      ).toEqual({
        pending: true,
      });
    });

    it('should handle FETCH_UPGRADEAVAILABLE_FULFILLED', () => {
      expect(
        reducer({}, {
          type: FETCH_UPGRADEAVAILABLE_FULFILLED,
          payload: mockPayload,
        })
      ).toEqual({
        status: mockPayload,
        pending: false,
        completed: true,
      });
    });


    it('should handle FETCH_UPGRADEAVAILABLE_REJECTED', () => {
      expect(
        reducer({}, {
          type: FETCH_UPGRADEAVAILABLE_REJECTED,
        })
      ).toEqual({
        pending: false,
      });
    });

    it('should remove all context when CLOSE_UPGRADEAVAILBALE and no context ()', () => {
      expect(
        reducer({ status: { ...mockPayload, upgradeAvailable: true } }, {
          type: CLOSE_UPGRADEAVAILBALE,
        })
      ).toEqual({ status: { ...mockPayload, upgradeAvailable: false } });
    });
  });
});
