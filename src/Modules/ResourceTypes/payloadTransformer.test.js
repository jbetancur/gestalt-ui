import { generateResourcePayload } from './payloadTransformer';

describe('(Payload Transformer)', () => {
  it('should request Generate the correct payload', () => {
    const sourcePayload = {
      name: 'Me',
      description: 'test',
      extend: '123',
      properties: { },
      property_defs: [],
    };

    const expectedPayload = {
      ...sourcePayload,
      name: 'Dont::Mock::Me',
    };

    expect(generateResourcePayload(sourcePayload, 'Dont::Mock')).to.deep.equal(expectedPayload);
  });
});
