import { combineReducers } from 'redux';
import reducerFactory from 'config/lib/reducerFactory';
import organizationModel from '../models/organization';
import workspaceModel from '../models/workspace';
import environmentModel from '../models/environment';
import selfModel from '../models/self';

export default combineReducers({
  self: reducerFactory({
    verbs: ['fetch'],
    key: 'self',
    category: 'self',
    model: selfModel.get(),
  }),
  sync: reducerFactory({
    verbs: ['do'],
    key: 'sync',
    category: 'sync',
    model: {},
  }),
  allOrganizations: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'allorgs',
    model: [],
  }),
  allOrganizationsDropDown: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'ALLORGSDROPDOWN',
    model: [],
  }),
  organizations: reducerFactory({
    verbs: ['fetch'],
    key: 'organizations',
    category: 'orgs',
    model: [],
  }),
  organization: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'organization',
    category: 'org',
    model: organizationModel.get(),
  }),
  organizationSet: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'organization',
    category: 'orgset',
    model: organizationModel.get(),
  }),
  workspaces: reducerFactory({
    verbs: ['fetch'],
    key: 'workspaces',
    category: 'workspaces',
    model: [],
  }),
  workspace: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'workspace',
    category: 'workspace',
    model: workspaceModel.get(),
  }),
  environments: reducerFactory({
    verbs: ['fetch'],
    key: 'environments',
    category: 'environments',
    model: [],
  }),
  environment: reducerFactory({
    verbs: ['fetch', 'create', 'update', 'delete'],
    key: 'environment',
    category: 'environment',
    model: environmentModel.get(),
  }),
});
