import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';
import yaml from 'js-yaml';

export const selectProvider = state => state.volumes.selectedProvider;
export const selectVolumes = state => state.metaResource.volumes.volumes;
export const selectVolume = state => state.metaResource.volume.volume;

export const getCreateVolumeModel = createSelector(
  [],
  () => metaModels.volume.get({
    properties: {
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
      model.properties.yaml = yaml.safeDump(model.properties.config);
    }

    return metaModels.volume.get(model);
  }
);
