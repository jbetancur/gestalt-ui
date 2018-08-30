import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { createResponsiveStateReducer } from 'redux-responsive';
import { notifierReducer } from 'Modules/Notifications';
import appReducers from '../App/reducers';
import metaResourceReducers from '../Modules/MetaResource/reducers';
import modalReducer from '../Modules/ModalRoot/reducers';
import errorNotificationReducer from '../Modules/ErrorNotifications/reducers';
import loginReducer from '../Modules/Authentication/reducers';
// import organizationsReducer from '../Modules/Organizations/reducers';
// import hierarchyReducer from '../Modules/Hierarchy/reducers';
// import providersReducer from '../Modules/Providers/reducers';
import lambdasReducer from '../Modules/Lambdas/reducers';
// import entitlementsReducer from '../Modules/Entitlements/reducers';
// import apisReducer from '../Modules/APIs/reducers';
// import apiEndpointsReducer from '../Modules/APIEndpoints/reducers';
// import usersReducer from '../Modules/Users/reducers';
// import groupsReducer from '../Modules/Groups/reducers';
import containersReducer from '../Modules/Containers/reducers';
// import policiesReducer from '../Modules/Policies/reducers';
import policyRulesReducer from '../Modules/PolicyRules/reducers';
import licensingReducer from '../Modules/Licensing/reducers';
// import secretReducers from '../Modules/Secrets/reducers';
import volumeReducers from '../Modules/Volumes/reducers';
import listFilterReducer from '../Modules/ListFilter/reducers';

const mediaQuery = {
  xs: '(min-width: 0) and (max-width: 599px)',
  sm: '(min-width: 600px) and (max-width: 959px)',
  md: '(min-width: 960px) and (max-width: 1280px)',
  lg: 'only screen and (min-width: 1280px)'
};

export default combineReducers({
  browser: createResponsiveStateReducer(mediaQuery),
  error: errorNotificationReducer,
  modal: modalReducer,
  routing: routerReducer,
  form: formReducer,
  app: appReducers,
  metaResource: metaResourceReducers,
  login: loginReducer,
  // hierarchy: hierarchyReducer,
  // providers: providersReducer,
  lambdas: lambdasReducer,
  // entitlements: entitlementsReducer,
  // users: usersReducer,
  // groups: groupsReducer,
  containers: containersReducer,
  // policies: policiesReducer,
  policyRules: policyRulesReducer,
  // apis: apisReducer,
  // apiEndpoints: apiEndpointsReducer,
  licensing: licensingReducer,
  // secrets: secretReducers,
  volumes: volumeReducers,
  listfilter: listFilterReducer,
  notifications: notifierReducer,
});
