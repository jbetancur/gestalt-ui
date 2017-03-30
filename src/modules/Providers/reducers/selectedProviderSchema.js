import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = {
  pending: false,
  completed: false,
  public: [],
  private: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case `providers/FETCH_${action.schemaType}_SCHEMA_PENDING`:
      return {
        ...state,
        pending: true,
      };
    case `providers/FETCH_${action.schemaType}_SCHEMA_FULFILLED`:
      return {
        ...state,
        pending: false,
        completed: true,
        public: action.payload.public,
        private: action.payload.private,
      };
    case `providers/FETCH_${action.schemaType}_SCHEMA_REJECTED`:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
