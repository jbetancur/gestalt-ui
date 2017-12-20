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
    format: 'Package format: {filename};{function} | Inline format: {function}',
    codeFormat: 'javascript',
    codeOptions: codeOptionsInline,
  },
  {
    value: 'java;scala',
    format: 'com.package.Class;function',
    codeFormat: 'java',
    codeOptions,
  },
  {
    value: 'java',
    format: 'com.package.Class;function',
    codeFormat: 'java',
    codeOptions,
  },
  {
    value: 'nashorn',
    format: 'Package format: {filename};{function} | Inline format: {function}',
    codeFormat: 'javascript',
    codeOptions: codeOptionsInline,
  },
  {
    value: 'python',
    format: '{filename}.py',
    codeFormat: 'python',
    codeOptions,
  },
  {
    value: 'csharp',
    format: '/path/to/executable',
    codeFormat: 'csharp',
    codeOptions,
  },
  {
    value: 'csharp;dotnet',
    format: '/path/to/executable',
    codeFormat: 'csharp',
    codeOptions,
  },
  {
    value: 'ruby',
    format: '{filename}.rb',
    codeFormat: 'ruby',
    codeOptions,
  },
  {
    value: 'golang',
    format: '{go executable filename}',
    codeFormat: 'golang',
    codeOptions,
  },
  {
    value: 'scala',
    format: 'com.package.Class;function',
    codeFormat: 'scala',
    codeOptions,
  },
  {
    value: 'bash',
    format: '',
    codeFormat: 'sh',
    codeOptions: codeOptionsInline,
  },
];
