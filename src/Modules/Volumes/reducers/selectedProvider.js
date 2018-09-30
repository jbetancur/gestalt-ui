import providerModel from '../../Providers/models/provider';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
} from '../constants';

const initialState = {
  type: null,
  provider: providerModel.get(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_SELECTED_PROVIDER:
      return initialState;
    case SELECTED_PROVIDER:
      return {
        isSelected: !!action.provider.id,
        type: action.providerType,
        provider: action.provider,
      };
    default:
      return state;
  }
};
