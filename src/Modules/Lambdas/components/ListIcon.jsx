import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NodejsIcon, JavaIcon, ScalaIcon, PythonIcon, CSharpIcon, GoLangIcon, RubyIcon, RhinoJSIcon } from 'components/Icons';

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 100px;
`;

const Runtime = styled.span`
  padding-left: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const iconTypes = {
  nodejs: <NodejsIcon />,
  java: <JavaIcon />,
  'java;scala': <ScalaIcon />,
  python: <PythonIcon />,
  'csharp;dotnet': <CSharpIcon />,
  golang: <GoLangIcon />,
  ruby: <RubyIcon />,
  nashorn: <RhinoJSIcon />,
};

const ListIcon = ({ runtime, label }) => {
  const icon = iconTypes[runtime];

  if (!icon) {
    return <span>{label || runtime}</span>;
  }

  return (
    <IconWrapper>
      <span>
        {icon}
      </span>
      <Runtime>
        {label || runtime}
      </Runtime>
    </IconWrapper>
  );
};

ListIcon.propTypes = {
  runtime: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ListIcon.defaultProps = {
  label: null,
};

export default ListIcon;
