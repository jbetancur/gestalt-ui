import { merge, cloneDeep } from 'lodash';
import { generatePayload, generatePatches } from './payloadTransformer';

const mockPayload = {
  name: '',
  description: '',
  properties: {
    env: [],
    headers: {
      Accept: 'text/plain'
    },
    code: '',
    code_type: 'package',
    compressed: false,
    cpus: 0.1,
    memory: 512,
    timeout: 30,
    handler: '',
    package_url: '',
    public: true,
    runtime: '',
    // Providers is really an array of {id, locations[]}
    provider: {
      id: '1',
    },
    periodic_info: {},
  },
};

describe('(Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.provider', () => {
      it('should generate the correct properties.provider payload', () => {
        const sourcePayload = cloneDeep(mockPayload);
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.provider).to.have.property('id');
        expect(payload.properties.provider).to.have.property('locations').that.is.empty;
      });
    });

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

    describe('properties.code_type', () => {
      it('should generate the correct payload when it is a package', () => {
        const sourcePayload = cloneDeep(mockPayload);
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).to.include({ code_type: 'package' });
        expect(payload.properties).to.have.property('compressed');
        expect(payload.properties).to.not.have.property('code');
      });

      it('should generate the correct payload when it is inline code', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            code_type: 'code',
            code: 'a'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).to.include({ code_type: 'code' });
        expect(payload.properties).to.include({ code: 'YQ==' });
        expect(payload.properties).to.not.have.property('compressed');
      });
    });

    describe('properties.periodic_info', () => {
      it('should generate the correct payload when it is no periodic_info', () => {
        const sourcePayload = cloneDeep(mockPayload);
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).to.have.property('periodic_info');
        expect(payload.properties.periodic_info).to.not.have.property('timezome');
        expect(payload.properties.periodic_info).to.not.have.property('schedule');
        expect(payload.properties.periodic_info).to.not.have.property('payload');
      });

      it('should generate the correct payload when periodic_info is missing properties.schedule', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            periodic_info: {
              payload: {}
            }
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.periodic_info).to.be.a('object').that.is.empty;
      });

      it('should generate the correct payload when periodic_info is provided properties.schedule', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            periodic_info: {
              schedule: 'ISO8601here',
              payload: {}
            }
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.periodic_info).to.be.a('object');
      });

      it('should generate the correct payload when periodic_info is provided properties.schedule a data payload is provided', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
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

        expect(payload.properties.periodic_info.payload).to.include({ data: 'YQ==' });
      });
    });

    describe('properties.runtime uniqueness is removed', () => {
      it('should generate the correct payload when a runtime needs to have the name normalized', () => {
        const sourcePayload = merge(cloneDeep(mockPayload), {
          properties: {
            runtime: 'nodejs---1'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.runtime).to.equal('nodejs');
      });
    });

    describe('updateMode', () => {
      it('should generate the correct payload when updateMode is specified as an argument', () => {
        const sourcePayload = cloneDeep(mockPayload);
        const payload = generatePayload(sourcePayload, true);

        expect(payload.properties.provider).to.have.property('id').that.equals('1');
        expect(payload.properties.provider).to.not.have.property('locations');
      });
    });
  });

  describe('generatePatches', () => {
    it('should not generate any patches if there is no difference', () => {
      const originalPayload = cloneDeep(mockPayload);
      const updatedPayload = cloneDeep(mockPayload);
      const payload = generatePatches(originalPayload, updatedPayload);

      expect(payload).to.be.a('array').that.is.empty;
    });

    it('should generate the correct patch payload code_type is changed from package to code', () => {
      const originalPayload = cloneDeep(mockPayload);
      const updatedPayload = merge(cloneDeep(mockPayload), {
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
        { op: 'add', path: '/properties/code', value: 'YQ==' }
      ];

      expect(payload).to.deep.equal(expectedPatches);
    });

    it('should generate the correct patch payload code_type is changed frm code to package', () => {
      const originalPayload = merge(cloneDeep(mockPayload), {
        properties: {
          code_type: 'code'
        }
      });

      const updatedPayload = merge(cloneDeep(mockPayload), {
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
        { op: 'add', path: '/properties/package_url', value: 'https://' }
      ];

      expect(payload).to.deep.equal(expectedPatches);
    });
  });
});
