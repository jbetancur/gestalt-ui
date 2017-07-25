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
          mode: 'RW',
          displayName: 'Read/Write',
        },
        {
          mode: 'RW-MANY',
          displayName: 'Read/Write Non-Exclusive',
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
        {
          mode: 'RW-MANY',
          displayName: 'Read/Write Non-Exclusive',
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
