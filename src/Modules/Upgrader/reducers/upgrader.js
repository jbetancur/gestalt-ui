import {
  FETCH_UPGRADEAVAILABLE_REQUEST,
  FETCH_UPGRADEAVAILABLE_FULFILLED,
  FETCH_UPGRADEAVAILABLE_REJECTED,
  CLOSE_UPGRADEAVAILBALE,
} from '../constants';

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

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_UPGRADEAVAILABLE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_UPGRADEAVAILABLE_FULFILLED:
      return {
        ...state,
        status: action.payload,
        // status: {
        //   ...action.payload,
        //   upgradeAvailable: true,
        //   upgradeImage: 'gcr.io/galactic-public-2018/upgradeFrom2.4.1TO2.4.2',
        //   upgradeNotes: 'http://docs.galacticfog.com/docs/patchnotes2.4.2.html',
        //   severity: 'recommended',
        // },
        pending: false,
        completed: true,
      };
    case FETCH_UPGRADEAVAILABLE_REJECTED:
      return {
        ...state,
        pending: false,
      };
    case CLOSE_UPGRADEAVAILBALE:
      return {
        ...state,
        status: {
          ...state.status,
          upgradeAvailable: false,
        },
      };
    default:
      return state;
  }
};
