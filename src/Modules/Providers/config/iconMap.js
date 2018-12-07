import React from 'react';
import {
  DockerIcon,
  MesosIcon,
  KubernetesIcon,
  ECSIcon,
  NodejsIcon,
  JavaIcon,
  PythonIcon,
  CSharpIcon,
  GoLangIcon,
  RubyIcon,
  RhinoJSIcon,
  BashIcon,
  LlvmIcon,
} from 'components/Icons';

const defaultSize = 24;

const iconMappings = (size, options) => ({
  // caas providers
  dcos: <MesosIcon size={size} {...options} />,
  kubernetes: <KubernetesIcon size={size} {...options} />,
  docker: <DockerIcon size={size} {...options} />,
  ecs: <ECSIcon size={size} {...options} />,

  // executors by resource_type - UPdated this llist instead
  NodeJS: <NodejsIcon size={size} {...options} />,
  Java: <JavaIcon size={size} {...options} />,
  Scala: <JavaIcon size={size} {...options} />,
  Python: <PythonIcon size={size} {...options} />,
  CSharp: <CSharpIcon size={size} {...options} />,
  GoLang: <GoLangIcon size={size} {...options} />,
  Ruby: <RubyIcon size={size} {...options} />,
  Nashorn: <RhinoJSIcon size={size} {...options} />,
  Bash: <BashIcon size={size} {...options} />,

  // executor providers by runtime kept for back compat - Deprecated
  nodejs: <NodejsIcon size={size} {...options} />,
  java: <JavaIcon size={size} {...options} />,
  'java;scala': <JavaIcon size={size} {...options} />,
  python: <PythonIcon size={size} {...options} />,
  csharp: <CSharpIcon size={size} {...options} />,
  'csharp;dotnet': <CSharpIcon size={size} {...options} />,
  golang: <GoLangIcon size={size} {...options} />,
  ruby: <RubyIcon size={size} {...options} />,
  nashorn: <RhinoJSIcon size={size} {...options} />,
  bash: <BashIcon size={size} {...options} />,
  'polyglot-jvm': <JavaIcon size={size} {...options} />,
  'polyglot-node': <NodejsIcon size={size} {...options} />,
  'polyglot-llvm': <LlvmIcon size={size} {...options} />,
});

export default (icon, size = defaultSize, options = {}) =>
  (icon ? iconMappings(size, options)[icon.toLowerCase()] : null);
