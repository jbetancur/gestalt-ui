import React from 'react';
import { Field } from 'react-final-form';

// eslint-disable-next-line react/prop-types
const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);

export default Condition;
