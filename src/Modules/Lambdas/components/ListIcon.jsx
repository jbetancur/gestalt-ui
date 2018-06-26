import React from 'react';
import PropTypes from 'prop-types';
import { NodejsIcon, JavaIcon, PythonIcon, CSharpIcon, GoLangIcon, RubyIcon, RhinoJSIcon } from 'components/Icons';

const iconTypes = {
  nodejs: <NodejsIcon />,
  java: <JavaIcon />,
  'java;scala': <JavaIcon />,
  python: <PythonIcon />,
  'csharp;dotnet': <CSharpIcon />,
  golang: <GoLangIcon />,
  ruby: <RubyIcon />,
  nashorn: <RhinoJSIcon />,
};

const ListIcon = ({ runtime }) => {
  const icon = iconTypes[runtime];

  if (!icon) {
    return <span>{runtime}</span>;
  }

  return <span>{icon}</span>;
};

ListIcon.propTypes = {
  runtime: PropTypes.string.isRequired,
};

export default ListIcon;
