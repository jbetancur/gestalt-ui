import { generateResourcePayload } from './payloadTransformer';

describe('(Payload Transformer)', () => {
  it('should request UNLOAD_ACTIONS', () => {
    const sourcePayload = {
      name: 'Me',
      description: 'test',
    };

    const expectedPayload = {
      name: 'Dont::Mock::Me',
      description: 'test'
    };

    expect(generateResourcePayload(sourcePayload, 'Dont::Mock')).to.deep.equal(expectedPayload);
  });
});
