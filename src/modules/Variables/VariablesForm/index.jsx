import React, { PropTypes } from 'react';
import { Field, FieldArray, FormSection } from 'redux-form';
import FieldRemoveButton from 'components/Buttons/FieldRemoveButton';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'components/TextField';

const renderField = ({ input, label, type, touched, error }) => (
  <Field
    {...input}
    className="flex-5"
    label={label}
    component={TextField}
    type={type}
    value=" " // fix for [object Object] on deselect
    errorText={touched && error}
    lineDirection="center"
    required
  />
);

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.string,
};

renderField.defaultProps = {
  touched: false,
  error: false,
};

const rendervariables = ({ fields, touched, error }) => (
  <FormSection>
    <Button
      flat
      primary
      label="Add Variable"
      onClick={() => fields.push({})}
    />
    {touched && error}
    {fields.map((member, index) =>
      <div key={index} className="flex-row">
        <Field
          name={`${member}.key`}
          type="text"
          component={renderField}
          label="Name"
          lineDirection="center"
        />
        <Field
          name={`${member}.value`}
          type="text"
          component={renderField}
          label="Value"
          lineDirection="center"
        />
        <div>
          <FieldRemoveButton onClick={() => fields.remove(index)} />
        </div>
      </div>
    )}
  </FormSection>
);

rendervariables.propTypes = {
  fields: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.string,
};

rendervariables.defaultProps = {
  touched: false,
  error: false,
};


const FieldArraysForm = () => <FieldArray name="variables" component={rendervariables} />;

export default FieldArraysForm;
