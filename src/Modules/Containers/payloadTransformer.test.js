import { merge, cloneDeep } from 'lodash';
import { generatePayload } from './payloadTransformer';

const mockPayload = {
  name: '',
  properties: {
    container_type: 'DOCKER',
    env: {},
    labels: [],
    accepted_resource_roles: [],
    constraints: [],
    provider: {
      locations: [],
    },
    force_pull: false,
    cpus: 0.1,
    memory: 128,
    num_instances: 1,
    port_mappings: [],
    health_checks: [],
    volumes: [],
    secrets: [],
  },
};

describe('(Container Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.env', () => {
      it('should convert properties.env array to a map', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            env: [{ name: 'test', value: 'this' }, { name: 'this', value: 'test' }],
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.env).to.deep.equal({ test: 'this', this: 'test' });
      });
    });

    describe('properties.labels', () => {
      it('should convert properties.labels array to a map', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            labels: [{ name: 'test', value: 'this' }, { name: 'this', value: 'test' }],
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.labels).to.deep.equal({ test: 'this', this: 'test' });
      });
    });

    describe('properties.num_instances', () => {
      it('should set properties.num_instances to 1 if it is \'\'', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            num_instances: ''
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.num_instances).to.equal(1);
      });
    });

    describe('properties.cmd', () => {
      it('should set trim cmd if it is present and there are spaces to trim at the end', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            cmd: 'echo hello      '
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.cmd).to.equal('echo hello');
      });

      it('should set remove cmd if it is \'\'', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            cmd: ''
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.cmd).to.not.exist;
      });
    });

    describe('properties.accepted_resource_roles', () => {
      it('should handle accepted_resource_roles if it is an Array', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            accepted_resource_roles: ['testrole', 'roletest']
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.accepted_resource_roles).to.deep.equal(['testrole', 'roletest']);
      });

      it('should handle accepted_resource_roles if it is a comma delimited string', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            accepted_resource_roles: 'testrole, roletest'
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.accepted_resource_roles).to.deep.equal(['testrole', 'roletest']);
      });

      it('should set remove accepted_resource_roles if it is \'\'', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            accepted_resource_roles: ''
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.accepted_resource_roles).to.not.exist;
      });
    });

    describe('properties.constraints', () => {
      it('should handle constraints if it is an Array', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            constraints: ['testrole', 'roletest']
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.constraints).to.deep.equal(['testrole', 'roletest']);
      });

      it('should handle constraints if it is a comma delimited string', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            constraints: 'testrole, roletest'
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.constraints).to.deep.equal(['testrole', 'roletest']);
      });

      it('should set remove constraints if it is \'\'', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            constraints: ''
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.constraints).to.not.exist;
      });
    });

    describe('properties.port_mappings', () => {
      it('should correctly format a port_mapping if it is enabled has virtual_hosts that comma delimited strings', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            port_mappings: [{ expose_endpoint: true, virtual_hosts: 'tick, tock' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.port_mappings).to.deep.equal([{ expose_endpoint: true, virtual_hosts: ['tick', 'tock'] }]);
      });

      it('should correctly format a port_mapping if it is enabled has virtual_hosts is an Array', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            port_mappings: [{ expose_endpoint: true, virtual_hosts: ['tick, tock'] }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.port_mappings).to.deep.equal([{ expose_endpoint: true, virtual_hosts: ['tick, tock'] }]);
      });

      it('should correctly format a port_mapping if it is disabled or there are no virtual_hosts', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            port_mappings: [{ expose_endpoint: false, virtual_hosts: '' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.port_mappings).to.deep.equal([{ expose_endpoint: false, virtual_hosts: '' }]);
      });
    });

    describe('properties.volumes', () => {
      it('should correctly format a volume if it is persistent', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            volumes: [{ type: 'persistent', host_path: '/lalala' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.volumes).to.deep.equal([{ type: 'persistent' }]);
      });

      it('should correctly format a volume if it is not persistent', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            volumes: [{ type: 'RO', host_path: '/lalala' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.volumes).to.deep.equal([{ type: 'RO', host_path: '/lalala' }]);
      });
    });

    describe('properties.provider', () => {
      it('should delete provider in updateMode so it is not PATCHED', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            provider: { id: '1' }
          }
        });
        const payload = generatePayload(sourcePayload, [], true);

        expect(payload.properties.provider).to.not.exist;
      });
    });
  });
});
