import { metaModels } from 'Modules/MetaResource';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(olume Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('when volume is external', () => {
      it('should convert the yaml prop to config', () => {
        const sourcePayload = metaModels.volume.create({
          properties: {
            type: 'external',
            provider: { id: '123' },
            yaml: 'test: test'
          }
        });
        const payload = generatePayload(sourcePayload);
        const expectedPayload = {
          ...sourcePayload,
          properties: {
            ...sourcePayload.properties,
            config: { test: 'test' },
          },
        };

        delete expectedPayload.properties.yaml;

        expect(payload).toEqual(expectedPayload);
      });
    });

    describe('when size_unit is GiB', () => {
      it('should convert GiB to MiB', () => {
        const sourcePayload = metaModels.volume.create({
          properties: {
            provider: { id: '123' },
            size: 2,
            size_unit: 'GiB',
          }
        });
        const payload = generatePayload(sourcePayload);
        const expectedPayload = {
          ...sourcePayload,
          properties: {
            ...sourcePayload.properties,
            size: 2048,
          },
        };

        expect(payload).toEqual(expectedPayload);
      });
    });

    describe('when size_unit is MiB', () => {
      it('should not do any conversion', () => {
        const sourcePayload = metaModels.volume.create({
          properties: {
            provider: { id: '123' },
            size: 2,
            size_unit: 'MiB',
          }
        });
        const payload = generatePayload(sourcePayload);
        const expectedPayload = { ...sourcePayload };

        expect(payload).toEqual(expectedPayload);
      });
    });
  });

  describe('generatePatches', () => {
    it('should generate patch ops if there is a change', () => {
      const originalPayload = metaModels.volume.get();
      const updatedPayload = metaModels.volume.get({
        description: 'change me',
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'add', path: '/description', value: 'change me' }
      ];

      expect(payload).toEqual(expectedPatches);
    });
  });
});
