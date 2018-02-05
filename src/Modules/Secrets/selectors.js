import { createSelector } from 'reselect';

export const selectSecret = state => state.metaResource.secret.secret;

export const getCreateSecretModel = createSelector(
  [],
  () => {
    const model = {
      name: '',
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
      name: secret.name,
      description: secret.description,
      properties: {
        provider: secret.properties.provider,
        items: secret.properties.items || [],
      },
    };

    return model;
  }
);
