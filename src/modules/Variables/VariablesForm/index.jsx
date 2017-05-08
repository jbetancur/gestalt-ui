import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, FormSection } from 'redux-form';
import { Button, FieldRemoveButton } from 'components/Buttons';
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
    required
  />
);

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
};

renderField.defaultProps = {
  touched: false,
  error: false,
};

const rendervariables = ({ fields, touched, error, addButtonLabel, icon, keyFieldName, keyFieldValue, valueFieldName, valueFieldValue }) => (
  <FormSection name="">
    <Button
      flat
      primary
      label={addButtonLabel}
      onClick={() => fields.push({})}
    >
      {icon}
    </Button>
    {touched && error}
    {fields.map((member, index) =>
      <div key={index} className="flex-row no-gutter">
        <Field
          name={`${member}.${keyFieldValue}`}
          type="text"
          component={renderField}
          label={keyFieldName}
        />
        <Field
          name={`${member}.${valueFieldValue}`}
          type="text"
          component={renderField}
          label={valueFieldName}
        />
        <FieldRemoveButton onClick={() => fields.remove(index)} />
      </div>
    )}
  </FormSection>
);

rendervariables.propTypes = {
  fields: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  addButtonLabel: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  keyFieldName: PropTypes.string.isRequired,
  keyFieldValue: PropTypes.string.isRequired,
  valueFieldName: PropTypes.string.isRequired,
  valueFieldValue: PropTypes.string.isRequired,
};

rendervariables.defaultProps = {
  touched: false,
  error: false,
};

const FieldArraysForm = props => <FieldArray
  addButtonLabel={props.addButtonLabel}
  icon={props.icon}
  name={props.fieldName}
  component={rendervariables}
  keyFieldName={props.keyFieldName}
  keyFieldValue={props.keyFieldValue}
  valueFieldName={props.valueFieldName}
  valueFieldValue={props.valueFieldValue}
/>;

FieldArraysForm.propTypes = {
  fieldName: PropTypes.string,
  addButtonLabel: PropTypes.string,
  icon: PropTypes.string,
  keyFieldName: PropTypes.string,
  keyFieldValue: PropTypes.string,
  valueFieldName: PropTypes.string,
  valueFieldValue: PropTypes.string,
};

FieldArraysForm.defaultProps = {
  fieldName: 'variables',
  addButtonLabel: 'Variable',
  icon: 'add',
  keyFieldName: 'Name',
  keyFieldValue: 'name',
  valueFieldName: 'Value',
  valueFieldValue: 'value',
};

export default FieldArraysForm;
