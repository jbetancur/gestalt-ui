import { getLastFromSplit } from 'util/helpers/strings';
import {
  SELECTED_PROVIDER,
} from './actionTypes';
import providerModel from '../Providers/models/provider';

/**
 * setSelectedProvider
 * @param {*} provider
 */
export function setSelectedProvider(provider = {}) {
  const providerType = getLastFromSplit(provider.resource_type);
  const model = providerModel.get(provider);
  const supportsSecrets = () => {
    switch (providerType) {
      case 'Kubernetes':
        return true;
      case 'Docker':
        return false;
      case 'DCOS':
        if (model.properties.config.secret_support) {
          return true;
        }
        return false;
      default:
        return false;
    }
  };

  const supportsHealth = () => {
    switch (providerType) {
      case 'Kubernetes':
        return true;
      case 'Docker':
        return false;
      case 'DCOS':
        return true;
      default:
        return false;
    }
  };

  const setDefaultNetworks = () => {
    switch (providerType) {
      case 'Docker':
        return false;
      case 'DCOS':
        return [{ name: 'BRIDGE' }];
      case 'ECS':
        return [{ name: 'bridge' }];
      default:
        return [{ name: 'default' }];
    }
  };

  const supportsOther = () => {
    switch (providerType) {
      case 'Kubernetes':
        return true;
      case 'Docker':
        return false;
      case 'DCOS':
        return true;
      default:
        return false;
    }
  };

  return {
    type: SELECTED_PROVIDER,
    supportsSecrets: supportsSecrets(),
    supportsEvents: providerType === 'Kubernetes',
    supportsHealth: supportsHealth(),
    supportsOther: supportsOther(),
    networks: model.properties.config.networks
      && model.properties.config.networks.length
      ? model.properties.config.networks
      : setDefaultNetworks(),
    providerType,
    provider: model,
  };
}

export default {
  setSelectedProvider,
};
