import { metaModels } from 'Modules/MetaResource';
import { generatePayload } from './payloadTransformer';

describe('(Container Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.env', () => {
      it('should convert properties.env array to a map', () => {
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
          properties: {
            cmd: 'echo hello      '
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.cmd).to.equal('echo hello');
      });

      it('should set remove cmd if it is \'\'', () => {
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
          properties: {
            accepted_resource_roles: ['testrole', 'roletest']
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.accepted_resource_roles).to.deep.equal(['testrole', 'roletest']);
      });

      it('should handle accepted_resource_roles if it is a comma delimited string', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            accepted_resource_roles: 'testrole, roletest'
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.accepted_resource_roles).to.deep.equal(['testrole', 'roletest']);
      });

      it('should set remove accepted_resource_roles if it is \'\'', () => {
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
          properties: {
            constraints: ['testrole', 'roletest']
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.constraints).to.deep.equal(['testrole', 'roletest']);
      });

      it('should handle constraints if it is a comma delimited string', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            constraints: 'testrole, roletest'
          }
        });
        const payload = generatePayload(sourcePayload);
        expect(payload.properties.constraints).to.deep.equal(['testrole', 'roletest']);
      });

      it('should set remove constraints if it is \'\'', () => {
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
          properties: {
            port_mappings: [{ expose_endpoint: true, virtual_hosts: 'tick, tock' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.port_mappings).to.deep.equal([{ expose_endpoint: true, virtual_hosts: ['tick', 'tock'] }]);
      });

      it('should correctly format a port_mapping if it is enabled has virtual_hosts is an Array', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            port_mappings: [{ expose_endpoint: true, virtual_hosts: ['tick, tock'] }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.port_mappings).to.deep.equal([{ expose_endpoint: true, virtual_hosts: ['tick, tock'] }]);
      });

      it('should correctly format a port_mapping if it is disabled or there are no virtual_hosts', () => {
        const sourcePayload = metaModels.container.get({
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
        const sourcePayload = metaModels.container.get({
          properties: {
            volumes: [{ type: 'persistent', host_path: '/lalala' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.volumes).to.deep.equal([{ type: 'persistent' }]);
      });

      it('should correctly format a volume if it is not persistent', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            volumes: [{ type: 'RO', host_path: '/lalala' }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.volumes).to.deep.equal([{ type: 'RO', host_path: '/lalala' }]);
      });
    });

    describe('properties.health_checks', () => {
      it('should remove port it the port_type = index', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'HTTP', port_type: 'index', port: 1 }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'HTTP', port_type: 'index' }]);
      });

      it('should remove port_index it the port_type = number', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'HTTP', port_type: 'number', port_index: 1 }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'HTTP', port_type: 'number' }]);
      });

      it('should remove the correct properties it the protocol is TCP', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'TCP', path: '/wahoo', command: 'oxford comma', ignore_http_1xx: true }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'TCP' }]);
      });

      it('should remove the correct properties it the protocol is HTTP', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'HTTP', path: '/wahoo', command: 'oxford comma', ignore_http_1xx: true }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'HTTP', path: '/wahoo', ignore_http_1xx: true }]);
      });

      it('should remove the correct properties it the protocol is HTTPS', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'HTTPS', path: '/wahoo', command: 'oxford comma', ignore_http_1xx: true }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'HTTPS', path: '/wahoo', ignore_http_1xx: true }]);
      });


      it('should remove the correct properties it the protocol is COMMAND', () => {
        const sourcePayload = metaModels.container.get({
          properties: {
            health_checks: [{ protocol: 'COMMAND', path: '/wahoo', command: 'oxford comma', ignore_http_1xx: true, port_type: 'index', port_index: 1, port: 1 }]
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.health_checks).to.deep.equal([{ protocol: 'COMMAND', command: 'oxford comma' }]);
      });
    });

    describe('properties.provider', () => {
      it('should delete provider in updateMode so it is not PATCHED', () => {
        const sourcePayload = metaModels.container.get({
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
