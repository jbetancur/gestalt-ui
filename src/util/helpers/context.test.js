import {
  generateContextEntityState,
} from './context';

describe('Util Transformations', () => {
  describe('generateContextEntityState function', () => {
    it('should return null id, key when not in a workspace context', () => {
      const params = { fqon: 'fantastic' };

      expect(generateContextEntityState(params)).to.deep.equal({ id: null, key: null });
    });

    it('should return workspaceId, workspaces when in a workspace context', () => {
      const params = { fqon: 'fantastic', workspaceId: '1' };

      expect(generateContextEntityState(params)).to.deep.equal({ id: '1', key: 'workspaces' });
    });

    it('should return workspaceId, environments when in an environment context', () => {
      const params = { fqon: 'fantastic', workspaceId: '1', environmentId: '2' };

      expect(generateContextEntityState(params)).to.deep.equal({ id: '2', key: 'environments' });
    });

    it('should return providerId, providers when in an provider context', () => {
      const params = { fqon: 'fantastic', workspaceId: '1', environmentId: '2', providerId: '3' };

      expect(generateContextEntityState(params)).to.deep.equal({ id: '3', key: 'providers' });
    });
  });
});
