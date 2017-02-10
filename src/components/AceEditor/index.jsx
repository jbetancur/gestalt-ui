import React from 'react';
import 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/golang';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/theme/chrome';
import 'brace/theme/monokai';

/* eslint-disable react/prop-types */
export default ({ input, meta: { touched, error }, ...others }) => (
  <AceEditor {...input} {...others} error={touched && !!error} errorText={error} />
);