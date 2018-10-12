import React from 'react';
import PropTypes from 'prop-types';
import { NodejsIcon, JavaIcon, PythonIcon, CSharpIcon, GoLangIcon, RubyIcon, RhinoJSIcon, BashIcon } from 'components/Icons';

const iconTypes = {
  nodejs: <NodejsIcon />,
  java: <JavaIcon />,
  'java;scala': <JavaIcon />,
  python: <PythonIcon />,
  csharp: <CSharpIcon />,
  'csharp;dotnet': <CSharpIcon />,
  golang: <GoLangIcon />,
  ruby: <RubyIcon />,
  nashorn: <RhinoJSIcon />,
  bash: <BashIcon />,
};

const ListIcon = ({ runtime }) => {
  const icon = iconTypes[runtime.toLowerCase()];

  if (!icon) {
    return <span>{runtime}</span>;
  }

  return <span>{icon}</span>;
};

ListIcon.propTypes = {
  runtime: PropTypes.string,
};

ListIcon.defaultProps = {
  runtime: '',
};

export default ListIcon;
