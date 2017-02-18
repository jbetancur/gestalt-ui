export default [
  {
    displayName: 'HTTP',
    value: 'HTTP',
    supportsPortType: true,
    supportsURL: true,
    supportsCMD: false,
  },
  {
    displayName: 'HTTPS',
    value: 'HTTPS',
    supportsPortType: true,
    supportsURL: true,
    supportsCMD: false,
  },
  {
    displayName: 'TCP',
    value: 'TCP',
    supportsPortType: true,
    supportsURL: false,
    supportsCMD: false,
  },
  {
    displayName: 'COMMAND',
    value: 'COMMAND',
    supportsPortType: false,
    supportsURL: false,
    supportsCMD: true,
  }
];
