import {
  SELECT_RUNTIME,
} from '../constants';

const initialState = {
  value: null,
  defaultMem: 128,
  format: null,
  codeFormat: null,
  starterCode: null,
  options: {},
  codeOptions: [{ displayName: 'Package', value: 'package' }],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_RUNTIME:
      return action.runtime;
    default:
      return state;
  }
};
