import secretModel from './models/secret';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(Secret Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.name', () => {
      it('should be the same as properties.resource', () => {
        const sourcePayload = secretModel.create({
          properties: {
            provider: { id: '123' },
            items: [{ key: 'k', value: 'a' }]
          }
        });
        const payload = generatePayload(sourcePayload);
        const expectedPayload = { ...sourcePayload, properties: { ...sourcePayload.properties, items: [{ key: 'k', value: 'YQ==' }] } };

        expect(payload).toEqual(expectedPayload);
      });
    });

    describe('when item is file', () => {
      it('should not base64 encode', () => {
        const sourcePayload = secretModel.create({
          properties: {
            provider: { id: '123' },
            items: [{ key: 'k', value: 'apple', isFile: true }]
          }
        });
        const payload = generatePayload(sourcePayload);
        const expectedPayload = { ...sourcePayload, properties: { ...sourcePayload.properties, items: [{ key: 'k', value: 'apple' }] } };

        expect(payload).toEqual(expectedPayload);
      });
    });
  });

  describe('generatePatches', () => {
    it('should generate patch ops if there is a change but ignore secret.properties', () => {
      const originalPayload = secretModel.get();
      const updatedPayload = secretModel.get({
        name: 'change me',
        properties: {
          items: [{ key: 'dont', value: 'update' }]
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload);
      const expectedPatches = [
        { op: 'replace', path: '/name', value: 'change me' }
      ];

      expect(payload).toEqual(expectedPatches);
    });
  });
});
