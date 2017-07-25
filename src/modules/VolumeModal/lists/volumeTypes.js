export default {
  DCOS: [
    {
      type: 'Host',
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
      type: 'Persistent',
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
      type: 'Persistent',
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
      type: 'Host',
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
      type: 'Persistent',
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
      type: 'Host',
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
  ]
};
