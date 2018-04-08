import { metaModels } from 'Modules/MetaResource';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(APIEndpoint Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.name', () => {
      it('should be the same as properties.resource', () => {
        const sourcePayload = metaModels.apiEndpoint.get({
          properties: {
            resource: '/thisbeatest'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.name).to.equal('/thisbeatest');
      });
    });

    describe('properties.methods', () => {
      it('should convert properties.methods to an Array if there are methods defined', () => {
        const sourcePayload = metaModels.apiEndpoint.get({
          properties: {
            methods: 'GET,POST'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.methods).toEqual(['GET', 'POST']);
      });

      it('should convert properties.methods to [] if there no methods defined', () => {
        const sourcePayload = metaModels.apiEndpoint.get({
          properties: {
            methods: ''
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.methods).toEqual([]);
      });
    });

    describe('updateMode', () => {
      it('should remove container related properties if the implementation_type = lambda', () => {
        const sourcePayload = metaModels.apiEndpoint.get({
          properties: {
            implementation_type: 'lambda'
          }
        });
        const payload = generatePayload(sourcePayload, true);

        expect(payload.properties.container_port_name).to.not.exist;
      });

      it('should remove container related properties if the implementation_type = container', () => {
        const sourcePayload = metaModels.apiEndpoint.get({
          properties: {
            implementation_type: 'container',
            container_port_name: 'web'
          }
        });
        const payload = generatePayload(sourcePayload, true);

        expect(payload.properties.container_port_name).to.exist;
      });
    });
  });

  describe('generatePatches', () => {
    it('should generate patch ops if there is a change to a property', () => {
      const originalPayload = metaModels.apiEndpoint.get();
      const updatedPayload = metaModels.apiEndpoint.get({
        properties: {
          implementation_id: '123'
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'replace', path: '/properties/implementation_id', value: '123' },
        { op: 'replace', path: '/properties/methods', value: ['GET'] }
      ];

      expect(payload).to.have.deep.members(expectedPatches);
    });

    it('should generate 2 patch ops if there is a change to properties.resource', () => {
      const originalPayload = metaModels.apiEndpoint.get();
      const updatedPayload = metaModels.apiEndpoint.get({
        properties: {
          resource: '/wahoo'
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'replace', path: '/properties/methods', value: ['GET'] },
        { op: 'replace', path: '/properties/resource', value: '/wahoo' },
        { op: 'replace', path: '/name', value: '/wahoo' }
      ];

      expect(payload).to.have.deep.members(expectedPatches);
    });
  });
});
