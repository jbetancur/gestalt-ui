import { PREFIX } from '../actionTypes';
import { createRequestAction } from './actionFactory';

describe('actionFactory: createRequestAction', () => {
  test('it creates an unloadAction action creator', () => {
    const action = createRequestAction(['goto'], 'Jupiter');

    expect(action.unloadJupiter()).toEqual({ type: `${PREFIX}UNLOAD_JUPITER` });
  });

  test('it creates the requested action creator', () => {
    const action = createRequestAction(['goto'], 'Jupiter');

    expect(action.gotoJupiter({ yarg: 'matey' })).toEqual({ type: `${PREFIX}GOTO_JUPITER_REQUEST`, yarg: 'matey' });
  });
});
