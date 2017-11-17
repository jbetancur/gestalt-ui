import React from 'react';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

/* eslint-disable react/prop-types */
export default ({ input, ...others }) => (
  <Checkbox id={input.name} {...input} {...others} />
);
