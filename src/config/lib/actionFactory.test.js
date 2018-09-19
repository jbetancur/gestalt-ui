import { createRequestAction } from './actionFactory';

const PREFIX = 'metaResource/';

describe('actionFactory: createRequestAction', () => {
  test('it creates an unloadAction action creator', () => {
    const action = createRequestAction(['goto'], 'Jupiter');

    expect(action.unloadJupiter()).toEqual({ type: `${PREFIX}UNLOAD_JUPITER` });
  });

  test('it creates the requested action creator', () => {
    const action = createRequestAction(['goto'], 'Jupiter');

    expect(action.gotoJupiter({ yarg: 'matey' })).toEqual({ type: `${PREFIX}GOTO_JUPITER_REQUEST`, yarg: 'matey' });
  });

  test('it creates the requested action creator with default options', () => {
    const action = createRequestAction(['goto'], 'Jupiter', { withJuno: 'yes' });

    expect(action.gotoJupiter({ yarg: 'matey' })).toEqual({ type: `${PREFIX}GOTO_JUPITER_REQUEST`, yarg: 'matey', withJuno: 'yes' });
  });
});
