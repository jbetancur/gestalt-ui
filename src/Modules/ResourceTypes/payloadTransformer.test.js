import { generateResourcePayload, generatePatches } from './payloadTransformer';

const originalPayload = Object.freeze({
  name: 'Imma',
  description: 'test',
  extend: '123',
  properties: {
    abstract: true,
    actions: { prefix: 'morty' }
  },
  property_defs: [],
});

describe('(Payload Transformer) generateResourcePayload', () => {
  describe('generateResourcePayload', () => {
    it('should request Generate the correct payload', () => {
      const sourcePayload = {
        name: 'Me',
        description: 'test',
        extend: '123',
        properties: {},
        property_defs: [{ name: 'test', data_type: 'string' }],
      };

      const expectedPayload = {
        ...sourcePayload,
      };

      expect(generateResourcePayload(sourcePayload, 'Dont::Mock')).to.deep.equal(expectedPayload);
    });
  });

  describe('generatePatches', () => {
    it('should not generate any patches if there is no difference', () => {
      const updatedPayload = {
        ...originalPayload,
        properties: {
          ...originalPayload.properties,
          abstract: true,
        },
      };

      expect(generatePatches(originalPayload, updatedPayload)).to.be.an('array').that.is.empty;
    });

    it('should generate the correct patches if there is a difference', () => {
      const updatedPayload = {
        ...originalPayload,
        properties: {
          ...originalPayload.properties,
          abstract: false,
          actions: { prefix: 'imma-prefix' }
        },
      };

      const expectedPatches = [
        { op: 'replace', path: '/properties/actions/prefix', value: 'imma-prefix' },
        { op: 'replace', path: '/properties/abstract', value: false },
      ];

      expect(generatePatches(originalPayload, updatedPayload)).to.deep.equal(expectedPatches);
    });

    it('should not patch extends or property_defs', () => {
      const updatedPayload = {
        ...originalPayload,
        extend: 'nicetry',
        properties: {
          ...originalPayload.properties,
        },
        property_defs: [{ name: 'woopwoop' }]
      };

      expect(generatePatches(originalPayload, updatedPayload)).to.be.an('array').that.is.empty;
    });
  });
});
