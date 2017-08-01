import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Button, FieldRemoveButton } from 'components/Buttons';
import TextField from 'components/TextField';

const renderField = ({ input, label, type, className }) => (
  <Field
    {...input}
    className={className}
    label={label}
    component={TextField}
    type={type}
    value=" " // fix for [object Object] on deselect
    required
  />
);

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

const rendervariables = ({ fields, touched, error, addButtonLabel, icon, keyFieldName, keyFieldValue, valueFieldName, valueFieldValue, className }) => (
  <div>
    <Button
      flat
      primary
      label={addButtonLabel}
      onClick={() => fields.push({})}
    >
      {icon}
    </Button>
    {touched && error}
    {fields.map((member, index) => (
      <div key={index} className={className}>
        <Field
          name={`${member}.${keyFieldValue}`}
          type="text"
          component={renderField}
          label={keyFieldName}
          className="flex-5"
        />
        <Field
          name={`${member}.${valueFieldValue}`}
          type="text"
          component={renderField}
          label={valueFieldName}
          className="flex-6"
        />
        <FieldRemoveButton
          onClick={() => fields.remove(index)}
        />
      </div>
    ))}
  </div>
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
  className: PropTypes.string,
};

rendervariables.defaultProps = {
  touched: false,
  error: false,
  className: 'flex-row no-gutter',
};

const FieldArraysForm = props => (
  <FieldArray
    addButtonLabel={props.addButtonLabel}
    icon={props.icon}
    name={props.fieldName}
    component={rendervariables}
    keyFieldName={props.keyFieldName}
    keyFieldValue={props.keyFieldValue}
    valueFieldName={props.valueFieldName}
    valueFieldValue={props.valueFieldValue}
  />
);

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
