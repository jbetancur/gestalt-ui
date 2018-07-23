import { metaModels } from 'Modules/MetaResource';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(Lambda Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.provider', () => {
      it('should generate the correct properties.provider payload', () => {
        const sourcePayload = metaModels.lambda.get();
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.provider).toHaveProperty('id');
        expect(payload.properties.provider).toHaveProperty('locations', []);
      });
    });

    describe('properties.env', () => {
      it('should convert properties.env array to a map', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            env: [{ name: 'test', value: 'this' }, { name: 'this', value: 'test' }],
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.env).toEqual({ test: 'this', this: 'test' });
      });
    });

    describe('properties.code_type', () => {
      it('should generate the correct payload when it is a package', () => {
        const sourcePayload = metaModels.lambda.get();
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).toHaveProperty('code_type', 'package');
        expect(payload.properties).toHaveProperty('compressed');
        expect(payload.properties).not.toHaveProperty('code');
      });

      it('should generate the correct payload when it is inline code', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            code_type: 'code',
            code: 'a'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).toHaveProperty('code_type', 'code');
        expect(payload.properties).toHaveProperty('code', 'YQ==');
        expect(payload.properties).not.toHaveProperty('compressed');
      });
    });

    describe('properties.periodic_info', () => {
      it('should generate the correct payload when it is no periodic_info', () => {
        const sourcePayload = metaModels.lambda.get();
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).toHaveProperty('periodic_info');
        expect(payload.properties.periodic_info).not.toHaveProperty('timezome');
        expect(payload.properties.periodic_info).not.toHaveProperty('schedule');
        expect(payload.properties.periodic_info).not.toHaveProperty('payload');
      });

      it('should generate the correct payload when periodic_info is missing properties.schedule', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            periodic_info: {
              payload: {}
            }
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.periodic_info).toEqual({});
      });

      it('should generate the correct payload when periodic_info is provided properties.schedule', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            periodic_info: {
              schedule: 'ISO8601here',
              payload: {}
            }
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.periodic_info).toEqual({ payload: {}, schedule: 'ISO8601here' });
      });

      it('should generate the correct payload when periodic_info is provided properties.schedule a data payload is provided', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            periodic_info: {
              schedule: 'ISO8601here',
              payload: {
                data: 'a'
              }
            }
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.periodic_info.payload).toHaveProperty('data', 'YQ==');
      });
    });

    describe('updateMode', () => {
      it('should generate the correct payload when updateMode is specified as an argument', () => {
        const sourcePayload = metaModels.lambda.get({
          properties: {
            provider: {
              id: '1'
            },
          }
        });
        const payload = generatePayload(sourcePayload, true);

        expect(payload.properties.provider).toHaveProperty('id', '1');
        expect(payload.properties.provider).not.toHaveProperty('locations');
      });
    });
  });

  describe('generatePatches', () => {
    it('should generate the correct patch payload code_type is changed from package to code', () => {
      const originalPayload = metaModels.lambda.get();
      const updatedPayload = metaModels.lambda.get({
        properties: {
          code_type: 'code',
          code: 'a'
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'remove', path: '/properties/package_url' },
        { op: 'remove', path: '/properties/compressed' },
        { op: 'replace', path: '/properties/code_type', value: 'code' },
        { op: 'add', path: '/properties/code', value: 'YQ==' },
        { op: 'add', path: '/properties/secrets', value: [] },
      ];

      expect(payload).toEqual(expectedPatches);
    });

    it('should generate the correct patch payload code_type is changed frm code to package', () => {
      const originalPayload = metaModels.lambda.get({
        properties: {
          code_type: 'code'
        }
      });

      const updatedPayload = metaModels.lambda.get({
        properties: {
          code_type: 'package',
          compressed: false,
          package_url: 'https://'
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'replace',
          path: '/properties/code_type',
          value: 'package' },
        { op: 'remove', path: '/properties/code' },
        { op: 'add', path: '/properties/compressed', value: false },
        { op: 'add', path: '/properties/package_url', value: 'https://' },
        { op: 'add', path: '/properties/secrets', value: [] },
      ];

      expect(payload).toEqual(expectedPatches);
    });
  });
});
