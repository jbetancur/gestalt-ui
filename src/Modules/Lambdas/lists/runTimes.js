const codeOptions = [
  { displayName: 'Package', value: 'package' },
];

const codeOptionsInline = [
  ...codeOptions,
  { displayName: 'Inline', value: 'code' },
];

export default [
  {
    value: 'nodejs',
    defaultMem: 128,
    format: 'Package format: {filename};{function} | Inline format: {function}',
    codeFormat: 'javascript',
    options: {},
    codeOptions: codeOptionsInline,
  },
  {
    value: 'java;scala',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'java',
    options: {
      isolate: true,
    },
    codeOptions,
  },
  {
    value: 'java',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'java',
    options: {
      isolate: true,
    },
    codeOptions,
  },
  {
    value: 'nashorn',
    defaultMem: 128,
    format: 'Package format: {filename};{function} | Inline format: {function}',
    codeFormat: 'javascript',
    options: {},
    codeOptions: codeOptionsInline,
  },
  {
    value: 'python',
    defaultMem: 128,
    format: '{filename}.py',
    codeFormat: 'python',
    options: {},
    codeOptions,
  },
  {
    value: 'csharp',
    defaultMem: 512,
    format: '/path/to/executable',
    codeFormat: 'csharp',
    options: {},
    codeOptions,
  },
  {
    value: 'csharp;dotnet',
    defaultMem: 512,
    format: '/path/to/executable',
    codeFormat: 'csharp',
    options: {},
    codeOptions,
  },
  {
    value: 'ruby',
    defaultMem: 128,
    format: '{filename}.rb',
    codeFormat: 'ruby',
    options: {},
    codeOptions,
  },
  {
    value: 'golang',
    defaultMem: 128,
    format: '{go executable filename}',
    codeFormat: 'golang',
    options: {},
    codeOptions,
  },
  {
    value: 'scala',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'scala',
    options: {
      isolate: true,
    },
    codeOptions,
  },
  {
    value: 'bash',
    defaultMem: 128,
    format: '',
    codeFormat: 'sh',
    options: {},
    codeOptions: codeOptionsInline,
  },
];
