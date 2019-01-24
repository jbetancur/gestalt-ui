import lambdaModel from './models/lambda';
import { generatePayload } from './payloadTransformer';

describe('(Lambda Payload Transformer) generatePayload', () => {
  describe('generatePayload', () => {
    describe('properties.provider', () => {
      it('should generate the correct properties.provider payload', () => {
        const sourcePayload = lambdaModel.get();
        const payload = generatePayload(sourcePayload);

        expect(payload.properties.provider).toHaveProperty('id');
        expect(payload.properties.provider).toHaveProperty('locations', []);
      });
    });

    describe('properties.code_type', () => {
      it('should generate the correct payload when it is a package', () => {
        const sourcePayload = lambdaModel.get();
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).toHaveProperty('code_type', 'package');
        expect(payload.properties).toHaveProperty('compressed');
        expect(payload.properties).not.toHaveProperty('code');
      });

      it('should generate the correct payload when it is inline code', () => {
        const sourcePayload = lambdaModel.get({
          properties: {
            code_type: 'code',
            code: 'a'
          }
        });
        const payload = generatePayload(sourcePayload);

        expect(payload.properties).toHaveProperty('code_type', 'code');
        expect(payload.properties).toHaveProperty('code', 'YQ==');
        expect(payload.properties).not.toHaveProperty('package_url');
        expect(payload.properties).not.toHaveProperty('compressed');
      });
    });

    describe('updateMode', () => {
      it('should generate the correct payload when updateMode is specified as an argument', () => {
        const sourcePayload = lambdaModel.get({
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
});
