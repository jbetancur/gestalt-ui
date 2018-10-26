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
} from 'components/Icons';

const defaultSize = 22;

const iconMappings = (size, options) => ({
  // caas providers
  dcos: <MesosIcon size={size} {...options} />,
  kubernetes: <KubernetesIcon size={size} {...options} />,
  docker: <DockerIcon size={size} {...options} />,
  ecs: <ECSIcon size={size} {...options} />,

  // executor providers
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
});

export default (icon, size = defaultSize, options = {}) =>
  (icon ? iconMappings(size, options)[icon.toLowerCase()] : null);
