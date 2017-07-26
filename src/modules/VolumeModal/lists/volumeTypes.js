export default {
  DCOS: [
    {
      type: 'host',
      displayName: 'Host',
      modes: [
        {
          mode: 'RO',
          displayName: 'Read Only',
        },
        {
          mode: 'RW',
          displayName: 'Read/Write',
        }
      ],
    },
    {
      type: 'persistent',
      displayName: 'Persistent',
      modes: [
        {
          mode: 'RW',
          displayName: 'Read/Write',
        },
      ],
    },
  ],
  Kubernetes: [
    {
      type: 'persistent',
      displayName: 'Persistent',
      modes: [
        {
          mode: 'ReadOnlyMany',
          displayName: 'Read-Only',
        },
        {
          mode: 'ReadWriteOnce',
          displayName: 'Read/Write',
        },
        {
          mode: 'ReadWriteMany',
          displayName: 'Read/Write (many)',
        },
      ],
    },
  ],
  Docker: [
    {
      type: 'host',
      displayName: 'Host',
      modes: [
        {
          mode: 'RO',
          displayName: 'Read Only',
        },
        {
          mode: 'RW',
          displayName: 'Read/Write',
        }
      ],
    },
    {
      type: 'persistent',
      displayName: 'Persistent',
      modes: [
        {
          mode: 'RW',
          displayName: 'Read/Write',
        },
      ],
    },
  ],
  default: [
    {
      type: 'host',
      displayName: 'Host',
      modes: [
        {
          mode: 'RO',
          displayName: 'Read Only',
        },
        {
          mode: 'RW',
          displayName: 'Read/Write',
        }
      ],
    },
  ],
};
