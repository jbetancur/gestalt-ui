export default [
  {
    type: 'Host',
    modes: [{ mode: 'RO', displayName: 'Read Only' }, { mode: 'RW', displayName: 'Read/Write' }],
  },
  {
    type: 'Persistent',
    modes: [{ mode: 'RW', displayName: 'Read/Write' }],
  }
];
