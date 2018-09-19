import { createSelector } from 'reselect';
import secretModel from './models/secret';

export const selectSecrets = state => state.secrets.secrets.secrets;
export const selectSecret = state => state.secrets.secret.secret;

export const getCreateSecretModel = createSelector(
  [],
  () => {
    const model = {
      properties: {
        items: [{ key: '', value: '' }],
      },
    };

    return secretModel.get(model);
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

    return secretModel.create(model);
  }
);
