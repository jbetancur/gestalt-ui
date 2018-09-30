import providerModel from '../../Providers/models/provider';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
} from '../constants';

const initialState = {
  isSelected: false,
  supportsHealth: false,
  supportsSecrets: false,
  networks: [],
  type: null,
  provider: providerModel.get(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_SELECTED_PROVIDER:
      return initialState;
    case SELECTED_PROVIDER:
      return {
        type: action.providerType,
        isSelected: !!action.provider.id,
        supportsHealth: action.supportsHealth,
        supportsSecrets: action.supportsSecrets,
        networks: action.networks,
        provider: action.provider,
      };
    default:
      return state;
  }
};
