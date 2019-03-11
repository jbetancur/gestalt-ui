import { createSelector } from 'reselect';
import containerModel from '../../Containers/models/container';
import providerModel from '../models/provider';

// const selectEnvSchema = state => state.providers.provider.envSchema;
const selectProvider = state => state.providers.provider.provider;
export const selectContainerProvider = state => state.containers.selectedProvider;
export const selectContainer = state => state.providers.container.container;
export const selectHasContainer = state => state.providers.provider.hasContainer;
export const selectSelectedProviderType = state => state.providers.provider.selectedProviderType;

export const getCreateProviderModel = createSelector(
  [selectSelectedProviderType, selectHasContainer],
  (providerType, hasContainer) => {
    if (providerType.model) {
      return providerType.model.initForm({}, hasContainer);
    }

    return providerModel.initForm();
  }
);

export const getEditProviderModel = createSelector(
  [selectProvider, selectSelectedProviderType],
  (provider, providerType) => {
    if (providerType.model) {
      return providerType.model.initForm(provider);
    }

    return providerModel.initForm(provider);
  }
);

// RAGE
export const getProviderContainer = createSelector(
  [selectProvider, selectHasContainer, selectSelectedProviderType],
  (provider, hasContainer, providerType) => {
    let castedProvider;

    if (providerType.model) {
      castedProvider = providerType.model.initForm(provider);
    } else {
      castedProvider = providerModel.initForm(provider);
    }

    return hasContainer
      ? containerModel.get(castedProvider.properties.services[0].container_spec)
      : containerModel.get();
  }
);
