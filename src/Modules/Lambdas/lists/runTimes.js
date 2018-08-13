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
    codeOptions: codeOptionsInline,
  },
  {
    value: 'java;scala',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'java',
    codeOptions,
  },
  {
    value: 'java',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'java',
    codeOptions,
  },
  {
    value: 'nashorn',
    defaultMem: 128,
    format: 'Package format: {filename};{function} | Inline format: {function}',
    codeFormat: 'javascript',
    codeOptions: codeOptionsInline,
  },
  {
    value: 'python',
    defaultMem: 128,
    format: '{filename}.py',
    codeFormat: 'python',
    codeOptions,
  },
  {
    value: 'csharp',
    defaultMem: 512,
    format: '/path/to/executable',
    codeFormat: 'csharp',
    codeOptions,
  },
  {
    value: 'csharp;dotnet',
    defaultMem: 512,
    format: '/path/to/executable',
    codeFormat: 'csharp',
    codeOptions,
  },
  {
    value: 'ruby',
    defaultMem: 128,
    format: '{filename}.rb',
    codeFormat: 'ruby',
    codeOptions,
  },
  {
    value: 'golang',
    defaultMem: 128,
    format: '{go executable filename}',
    codeFormat: 'golang',
    codeOptions,
  },
  {
    value: 'scala',
    defaultMem: 512,
    format: 'com.package.Class;function',
    codeFormat: 'scala',
    codeOptions,
  },
  {
    value: 'bash',
    defaultMem: 128,
    format: '',
    codeFormat: 'sh',
    codeOptions: codeOptionsInline,
  },
];
