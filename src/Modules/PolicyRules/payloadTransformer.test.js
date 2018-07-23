import { metaModels } from 'Modules/MetaResource';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(Policy Event Rule Payload Transformer)', () => {
  describe('generatePayload', () => {
    it('should generate the correct payload when it is a limit policy', () => {
      const sourcePayload = metaModels.policyRule.create();
      const payload = generatePayload(sourcePayload, [], false, 'limit');

      expect(payload.resource_type).toBe('Gestalt::Resource::Rule::Limit');
      expect(payload.properties).not.toHaveProperty('lambda');
      expect(payload.properties).toHaveProperty('eval_logic');
    });

    it('should generate the correct payload when it is a event policy', () => {
      const sourcePayload = metaModels.policyRule.create({ properties: { lambda: { id: '123' } } });
      const payload = generatePayload(sourcePayload, [], false, 'event');

      expect(payload.resource_type).toBe('Gestalt::Resource::Rule::Event');
      expect(payload.properties).not.toHaveProperty('eval_logic');
      expect(payload.properties.lambda).toHaveProperty('id', '123');
    });
  });

  describe('generatePatches', () => {
    it('should generate the correct patches when it is a limit policy', () => {
      const originalPayload = metaModels.policyRule.get();
      const updatedPayload = metaModels.policyRule.create({
        name: 'test',
        description: 'hi',
        properties: {
          match_actions: ['takeaction'],
          eval_logic: { operator: 'whoa' },
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload, ['takeaction'], 'limit');
      const expectedPatches = [
        { op: 'replace', path: '/name', value: 'test' },
        { op: 'replace', path: '/description', value: 'hi' },
        { op: 'add', path: '/properties/match_actions/0', value: 'takeaction' },
        { op: 'add', path: '/properties/eval_logic', value: { operator: 'whoa' } },
      ];

      expect(payload.length).toBe(4);
      expect(payload).toContainEqual(expectedPatches[0]);
      expect(payload).toContainEqual(expectedPatches[1]);
      expect(payload).toContainEqual(expectedPatches[2]);
    });

    it('should generate the correct patches when it is a event policy', () => {
      const originalPayload = metaModels.policyRule.get();
      const updatedPayload = metaModels.policyRule.create({
        name: 'test',
        description: 'hi',
        properties: {
          match_actions: ['takeaction'],
          lambda: { id: '123' }
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload, ['takeaction'], 'event');
      const expectedPatches = [
        { op: 'replace', path: '/name', value: 'test' },
        { op: 'replace', path: '/description', value: 'hi' },
        { op: 'add', path: '/properties/lambda', value: '123' },
        { op: 'add', path: '/properties/match_actions/0', value: 'takeaction' },
      ];

      expect(payload.length).toBe(4);
      expect(payload).toContainEqual(expectedPatches[0]);
      expect(payload).toContainEqual(expectedPatches[1]);
      expect(payload).toContainEqual(expectedPatches[2]);
    });
  });
});
