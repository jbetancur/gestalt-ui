import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectSecrets = state => state.metaResource.secrets.secrets;
export const selectSecret = state => state.metaResource.secret.secret;

export const getCreateSecretModel = createSelector(
  [],
  () => {
    const model = {
      properties: {
        items: [{ key: '', value: '' }],
      },
    };

    return metaModels.secret.get(model);
  }
);

export const getEditSecretModel = createSelector(
  [selectSecret],
  (secret) => {
    const model = {
      name: secret.name,
      description: secret.description,
      properties: {
        provider: secret.properties.provider,
        items: secret.properties.items || [],
      },
    };

    return metaModels.secret.create(model);
  }
);
