import { createSelector } from 'reselect';
import yaml from 'js-yaml';

// Meta States
export const selectProvider = state => state.volumes.selectedProvider;
export const selectVolumes = state => state.volumes.volumes.volumes;
export const selectVolume = state => state.volumes.volume.volume;

// Module States
export const selectVolumeListing = state => state.volumes.volumeListing.volumes;

export const getCreateVolumeModel = createSelector(
  [selectVolume],
  volume => ({
    ...volume,
    properties: {
      ...volume.properties,
      type: 'host_path',
      size: 1,
      size_unit: 'MiB',
      access_mode: 'ReadWriteOnce',
      config: {},
    },
  }),
);

export const getEditVolumeModel = createSelector(
  [selectVolume],
  (volume) => {
    const model = { ...volume };

    model.properties.size_unit = 'MiB';

    if (model.properties.type === 'external' && model.properties.config) {
      Object.assign(model, {
        ...model,
        properties: {
          ...model.properties,
          yaml: yaml.safeDump(model.properties.config),
        },
      });
    }

    return model;
  }
);
