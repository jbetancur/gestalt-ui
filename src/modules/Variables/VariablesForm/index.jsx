import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Button, FieldRemoveButton } from 'components/Buttons';
import TextField from 'components/TextField';
import { isUnixVariable } from 'util/validations';

const validateUnixName = value => ((value && !isUnixVariable(value)) && 'invalid variable');

// eslint-disable-next-line react/prop-types
const renderNameField = ({ input, label, type, className, disabled, required, unixVariableName }) => (
  <Field
    {...input}
    className={className}
    placeholder={label}
    component={TextField}
    type={type}
    value=" " // fix for [object Object] on deselect
    required={required}
    disabled={disabled}
    rows={1}
    validate={unixVariableName ? [validateUnixName] : []}
  />
);

// eslint-disable-next-line react/prop-types
const renderValueField = ({ input, label, type, className, disabled, required }) => (
  <Field
    {...input}
    className={className}
    placeholder={label}
    component={TextField}
    type={type}
    value=" " // fix for [object Object] on deselect
    required={required}
    disabled={disabled}
    rows={1}
    validate={[]}
  />
);

const rendervariables = ({ fields, touched, error, addButtonLabel, icon, keyFieldName, keyFieldValue, valueFieldName, valueFieldValue, className, unixVariableName }) => (
  <div>
    <Button
      flat
      primary
      label={addButtonLabel}
      onClick={() => fields.unshift({})}
    >
      {icon}
    </Button>
    {touched && error}
    {fields.map((member, index) => {
      const isRequired = fields.get(index).required;
      const isInherited = fields.get(index).inherited;
      const fieldNameStr = isInherited ? `${keyFieldName} (inherit)` : keyFieldName;

      return (
        <div key={index} className={className}>
          <Field
            name={`${member}.${keyFieldValue}`}
            type="text"
            component={renderNameField}
            label={fieldNameStr}
            className="flex-4"
            disabled={isRequired || isInherited}
            unixVariableName={unixVariableName}
          />
          <Field
            name={`${member}.${valueFieldValue}`}
            type="text"
            component={renderValueField}
            label={valueFieldName}
            className="flex-7"
            required={isRequired}
          />
          {!(isRequired || isInherited) &&
            <FieldRemoveButton
              marginTop="1em"
              onClick={() => fields.remove(index)}
            />}
        </div>
      );
    })}
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
  unixVariableName: PropTypes.bool.isRequired,
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
    unixVariableName={props.unixVariableName}
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
  unixVariableName: PropTypes.bool,
};

FieldArraysForm.defaultProps = {
  fieldName: 'variables',
  addButtonLabel: 'Variable',
  icon: 'add_circle_outline',
  keyFieldName: 'Name',
  keyFieldValue: 'name',
  valueFieldName: 'Value',
  valueFieldValue: 'value',
  unixVariableName: false,
};

export default FieldArraysForm;
