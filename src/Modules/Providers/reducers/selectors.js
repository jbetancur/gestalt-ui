import { createSelector } from 'reselect';
import containerModel from '../../Containers/models/container';
import providerModel from '../models/provider';

// const selectEnvSchema = state => state.providers.provider.envSchema;
const selectProvider = state => state.providers.provider.provider;
export const selectContainerProvider = state => state.containers.selectedProvider;
export const selectContainer = state => state.providers.container.container;
export const selectHasContainer = state => state.providers.provider.hasContainer;

export const getCreateProviderModel = createSelector(
  [],
  () => providerModel.initForm(),
);

export const getEditProviderModel = createSelector(
  [selectProvider],
  provider => providerModel.initForm(provider),
);

// RAGE
export const getProviderContainer = createSelector(
  [selectProvider, selectHasContainer],
  (provider, hasContainer) => {
    const model = providerModel.initForm(provider);

    return hasContainer
      ? containerModel.get(model.properties.services[0].container_spec)
      : containerModel.get();
  }
);
