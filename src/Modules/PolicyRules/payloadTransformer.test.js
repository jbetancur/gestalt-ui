import policyRuleModel from './models/policyRule';
import { generatePayload, generatePatches } from './payloadTransformer';

describe('(Policy Event Rule Payload Transformer)', () => {
  describe('generatePayload', () => {
    it('should generate the correct payload when it is a limit policy', () => {
      const sourcePayload = policyRuleModel.create();
      const payload = generatePayload(sourcePayload, false, 'limit');

      expect(payload.resource_type).toBe('Gestalt::Resource::Rule::Limit');
      expect(payload.properties).not.toHaveProperty('lambda');
      expect(payload.properties).toHaveProperty('eval_logic');
    });

    it('should generate the correct payload when it is a event policy', () => {
      const sourcePayload = policyRuleModel.create({ properties: { lambda: { id: '123' } } });
      const payload = generatePayload(sourcePayload, false, 'event');

      expect(payload.resource_type).toBe('Gestalt::Resource::Rule::Event');
      expect(payload.properties).not.toHaveProperty('eval_logic');
      expect(payload.properties.lambda).toHaveProperty('id', '123');
    });
  });

  describe('generatePatches', () => {
    it('should generate the correct patches when it is a limit policy', () => {
      const originalPayload = policyRuleModel.get();
      const updatedPayload = policyRuleModel.create({
        name: 'test',
        description: 'hi',
        properties: {
          match_actions: ['takeaction'],
          eval_logic: { operator: 'whoa' },
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload, 'limit');
      const expectedPatches = [
        { op: 'replace', path: '/name', value: 'test' },
        { op: 'replace', path: '/description', value: 'hi' },
        { op: 'add', path: '/properties/eval_logic', value: { operator: 'whoa' } },
      ];

      expect(payload.length).toBe(4);
      expect(payload).toContainEqual(expectedPatches[0]);
      expect(payload).toContainEqual(expectedPatches[1]);
    });

    it('should generate the correct patches when it is a event policy', () => {
      const originalPayload = policyRuleModel.get();
      const updatedPayload = policyRuleModel.create({
        name: 'test',
        description: 'hi',
        properties: {
          match_actions: ['takeaction'],
          lambda: { id: '123' }
        }
      });
      const payload = generatePatches(originalPayload, updatedPayload, 'event');
      const expectedPatches = [
        { op: 'replace', path: '/name', value: 'test' },
        { op: 'replace', path: '/description', value: 'hi' },
        { op: 'add', path: '/properties/lambda', value: '123' },
      ];

      expect(payload.length).toBe(4);
      expect(payload).toContainEqual(expectedPatches[0]);
      expect(payload).toContainEqual(expectedPatches[1]);
      expect(payload).toContainEqual(expectedPatches[2]);
    });
  });
});
