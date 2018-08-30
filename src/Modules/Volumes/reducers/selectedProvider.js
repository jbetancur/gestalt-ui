import { LOCATION_CHANGE } from 'react-router-redux';
import { metaModels } from 'Modules/MetaResource';
import {
  SELECTED_PROVIDER,
  UNLOAD_SELECTED_PROVIDER,
} from '../constants';

const initialState = {
  type: null,
  provider: metaModels.provider.get(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNLOAD_SELECTED_PROVIDER:
      return initialState;
    case LOCATION_CHANGE:
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
