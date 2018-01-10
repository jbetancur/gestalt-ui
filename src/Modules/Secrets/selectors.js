import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectSecret = state => state.metaResource.secret.secret;

export const getCreateSecretModel = createSelector(
  [],
  () => {
    const model = {
      ...metaModels.secret,
      name: '',
      description: '',
      properties: {
        provider: {},
        items: [{ key: '', value: '' }],
      },
    };

    return model;
  }
);

export const getEditSecretModel = createSelector(
  [selectSecret],
  (secret) => {
    const model = {
      ...metaModels.secret,
      name: secret.name,
      description: secret.description,
      properties: {
        provider: secret.properties.provider,
        items: secret.properties.items,
      },
    };

    return model;
  }
);
