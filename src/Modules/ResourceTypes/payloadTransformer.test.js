import { generateResourcePayload, generatePatches, batchTypeProps } from './payloadTransformer';

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


  describe('batchTypeProps', () => {
    it('should correctly map an array of property_defs add operations', () => {
      const mockSourceProps = [];

      const mockUpdatedProps = [
        {
          name: 'jedi',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          name: 'lightsaber',
          data_type: 'string',
          requirement_type: 'required'
        }
      ];

      const batchOps = batchTypeProps('999', mockSourceProps, mockUpdatedProps);
      const results = [
        { op: 'POST', resourceTypeId: '999', payload: { name: 'jedi', data_type: 'string', requirement_type: 'optional' } },
        { op: 'POST', resourceTypeId: '999', payload: { name: 'lightsaber', data_type: 'string', requirement_type: 'required' } },
      ];

      expect(batchOps).to.deep.equal(results);
    });

    it('should correctly map an array of property_defs update operations', () => {
      const mockSourceProps = [
        {
          id: '123',
          name: 'womprat',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '321',
          name: 'weapon',
          data_type: 'string',
          requirement_type: 'optional'
        }
      ];

      const mockUpdatedProps = [
        {
          id: '123',
          name: 'weapon',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '321',
          name: 'weapon',
          data_type: 'int',
          requirement_type: 'optional'
        }
      ];

      const batchOps = batchTypeProps('999', mockSourceProps, mockUpdatedProps);
      const results = [
        { op: 'PATCH', id: '123', patches: [{ op: 'replace', path: '/name', value: 'weapon' }] },
        { op: 'PATCH', id: '321', patches: [{ op: 'replace', path: '/data_type', value: 'int' }] },
      ];

      expect(batchOps).to.deep.equal(results);
    });

    it('should correctly map an array of property_defs delete operations', () => {
      const mockSourceProps = [
        {
          id: '123',
          name: 'womprat',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '321',
          name: 'obiwan',
          data_type: 'string',
          requirement_type: 'optional'
        },
      ];

      const mockUpdatedProps = [];

      const batchOps = batchTypeProps('999', mockSourceProps, mockUpdatedProps);
      const results = [
        { op: 'DELETE', id: '123' },
        { op: 'DELETE', id: '321' },
      ];

      expect(batchOps).to.deep.equal(results);
    });

    it('should correctly map an array of property_defs for combined update add and delete operations', () => {
      const mockSourceProps = [
        {
          id: '123',
          name: 'womprat',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '456',
          name: 'deleteme',
          data_type: 'string',
          requirement_type: 'optional'
        },
      ];

      const mockUpdatedProps = [
        {
          id: '123',
          name: 'weapon',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          name: 'speeder',
          data_type: 'string',
          requirement_type: 'optional'
        }
      ];

      const batchOps = batchTypeProps('999', mockSourceProps, mockUpdatedProps);
      const results = [
        { op: 'PATCH', id: '123', patches: [{ op: 'replace', path: '/name', value: 'weapon' }] },
        { op: 'POST', resourceTypeId: '999', payload: { name: 'speeder', data_type: 'string', requirement_type: 'optional' } },
        { op: 'DELETE', id: '456' },
      ];

      expect(batchOps).to.deep.equal(results);
    });

    it('should return items with [] patch ops if the source and updated properties are the same', () => {
      const mockSourceProps = [
        {
          id: '321',
          name: 'speeder',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '123',
          name: 'womprat',
          data_type: 'string',
          requirement_type: 'optional'
        },
      ];

      const mockUpdatedProps = [
        {
          id: '321',
          name: 'speeder',
          data_type: 'string',
          requirement_type: 'optional'
        },
        {
          id: '123',
          name: 'womprat',
          data_type: 'string',
          requirement_type: 'optional'
        },
      ];

      const batchOps = batchTypeProps('999', mockSourceProps, mockUpdatedProps);
      const results = [
        { op: 'PATCH', id: '321', patches: [] },
        { op: 'PATCH', id: '123', patches: [] },
      ];
      expect(batchOps).to.deep.equal(results);
    });
  });
});
