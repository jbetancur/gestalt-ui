export const SELECTED_PROVIDER = 'volumes/SELECTED_PROVIDER';
export const UNLOAD_SELECTED_PROVIDER = 'volumes/UNLOAD_SELECTED_PROVIDER';

export const volumeTypes = [
  {
    type: 'persistent',
    supported: ['DCOS'],
  },
  {
    type: 'host_path',
    supported: ['DCOS', 'Kubernetes'],
  },
  {
    type: 'dynamic',
    supported: ['Kubernetes'],
  },
  {
    type: 'external',
    supported: ['Kubernetes'],
  },
];

export const accessTypes = [
  {
    label: 'Read Write Once',
    value: 'ReadWriteOnce',
  },
  {
    label: 'Read Write Many',
    value: 'ReadWriteMany',
  },
  {
    label: 'Read Only Many',
    value: 'ReadOnlyMany',
  }
];

export const sizeUnits = ['MiB', 'GiB'];
