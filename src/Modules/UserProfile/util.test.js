import { generateRoutePathByTypeId } from './util';
import {
  ORGANIZATION,
  WORKSPACE,
  ENVIRONMENT,
  LAMBDA,
} from '../../constants';

describe('UserProfile::Util', () => {
  it('should generate the correct path when the context is an Org', () => {
    const mock = {
      resource_id: '123',
      resource_type_id: ORGANIZATION,
      resource_name: 'test',
      context: {
        org: {
          id: '333',
          name: 'root',
          fqon: 'root'
        }
      }
    };

    const url = generateRoutePathByTypeId(mock);

    expect(url).toBe('/root/hierarchy');
  });

  it('should generate the correct path when the context is a Workspace', () => {
    const mock = {
      resource_id: '123',
      resource_type_id: WORKSPACE,
      resource_name: 'test',
      context: {
        workspace: {
          id: '2222',
          name: 'workspace-1'
        },
        org: {
          id: '333',
          name: 'root',
          fqon: 'root'
        }
      }
    };

    const url = generateRoutePathByTypeId(mock);

    expect(url).toBe('/root/hierarchy/2222/environments');
  });

  it('should generate the correct path when the context is an Environment', () => {
    const mock = {
      resource_id: '123',
      resource_type_id: ENVIRONMENT,
      resource_name: 'test',
      context: {
        environment: {
          id: '1111',
          name: 'environment-1'
        },
        workspace: {
          id: '2222',
          name: 'workspace-1'
        },
        org: {
          id: '333',
          name: 'root',
          fqon: 'root'
        }
      }
    };

    const url = generateRoutePathByTypeId(mock);

    expect(url).toBe('/root/hierarchy/2222/environment/1111');
  });

  it('should generate the correct path when the context is an a Sub Resource', () => {
    const mock = {
      resource_id: '123',
      resource_type_id: LAMBDA,
      resource_name: 'test',
      context: {
        environment: {
          id: '1111',
          name: 'environment-1'
        },
        workspace: {
          id: '2222',
          name: 'workspace-1'
        },
        org: {
          id: '333',
          name: 'root',
          fqon: 'root'
        }
      }
    };

    const url = generateRoutePathByTypeId(mock);

    expect(url).toBe('/root/hierarchy/2222/environment/1111/lambdas/123');
  });
});
