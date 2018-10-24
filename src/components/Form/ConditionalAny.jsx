import React from 'react';
import { Field } from 'react-final-form';

// eslint-disable-next-line react/prop-types
const ConditionAny = ({ when, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value ? children : null)}
  </Field>
);

export default ConditionAny;
