//
import React from 'react';
import styled from 'styled-components';
import { TextField, FontIcon } from 'react-md';
import Tooltip from '@material-ui/core/Tooltip';

const ToolTipIcon = styled(FontIcon)`
  font-size: 16px !important;
`;

/* eslint-disable react/prop-types */
const InputField = ({ input, meta: { touched, error }, toolTip, ...rest }) => {
  const baseProps = {
    ...input,
    ...rest,
    id: input.name,
    error: touched && !!error,
    errorText: error,
  };

  if (toolTip) {
    Object.assign(baseProps, {
      rightIconStateful: false,
      rightIcon: (
        <Tooltip title={toolTip}>
          <ToolTipIcon>info_outline</ToolTipIcon>
        </Tooltip>
      ),
    });
  }

  return (
    <TextField {...baseProps} />
  );
};

InputField.defaultProps = {
  lineDirection: 'center',
  fullWidth: true,
};

export default InputField;
