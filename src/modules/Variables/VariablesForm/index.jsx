import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Button, FieldRemoveButton } from 'components/Buttons';
import TextField from 'components/TextField';

const renderNameField = (props) => {
  // eslint-disable-next-line react/prop-types
  const { input, label, type, className, disabled, required, keyFieldValidationMessage, keyFieldValidationFunction, onChange } = props;
  const doValidate =
    (keyFieldValidationMessage && keyFieldValidationFunction && typeof keyFieldValidationFunction === 'function');
  const validateKey = value => (value && !keyFieldValidationFunction(value)) && keyFieldValidationMessage;

  return (
    <Field
      {...input}
      className={className}
      label={label}
      component={TextField}
      type={type}
      value=" " // fix for [object Object] on deselect
      required={required}
      disabled={disabled}
      rows={1}
      validate={doValidate && validateKey}
      onChange={onChange}
    />
  );
};

const renderValueField = (props) => {
  // eslint-disable-next-line react/prop-types
  const { input, label, type, className, disabled, required, valueFieldValidationMessage, valueFieldValidationFunction, hideValueField } = props;
  const doValidate =
    (valueFieldValidationMessage && valueFieldValidationFunction && typeof valueFieldValidationFunction === 'function');
  const validateValue = value => (value && !valueFieldValidationFunction(value)) && valueFieldValidationMessage;

  return (
    !hideValueField &&
    <Field
      {...input}
      className={className}
      label={label}
      component={TextField}
      type={type}
      value=" " // fix for [object Object] on deselect
      required={required}
      disabled={disabled}
      rows={1}
      validate={doValidate && validateValue}
    />
  );
};

const renderPasswordField = (props) => {
  // eslint-disable-next-line react/prop-types
  const { input, label, className, disabled, required, valueFieldValidationMessage, valueFieldValidationFunction, hideValueField } = props;
  const doValidate =
    (valueFieldValidationMessage && valueFieldValidationFunction && typeof valueFieldValidationFunction === 'function');
  const validateValue = value => (value && !valueFieldValidationFunction(value)) && valueFieldValidationMessage;

  return (
    !hideValueField &&
    <Field
      {...input}
      className={className}
      label={label}
      component={TextField}
      style={{ marginTop: '14px' }}
      type="password"
      value=" " // fix for [object Object] on deselect
      required={required}
      disabled={disabled}
      validate={doValidate && validateValue}
    />
  );
};


const rendervariables = (props) => {
  const {
    fields,
    touched,
    error,
    addButtonLabel,
    icon,
    keyFieldName,
    keyFieldValue,
    valueFieldName,
    valueFieldValue,
    className,
    keyFieldValidationMessage,
    keyFieldValidationFunction,
    valueFieldValidationMessage,
    valueFieldValidationFunction,
    hideValueField,
    disabled
  } = props;
  return (
    <div>
      <Button
        flat
        iconChildren={icon}
        primary
        onClick={() => fields.unshift({})}
        disabled={disabled}
      >
        {addButtonLabel}
      </Button>
      {touched && error}
      {fields.map((member, index) => {
        const field = fields.get(index);
        const isRequired = field.required;
        const isInherited = field.inherited;
        const isPassword = fields.get(index).name.toUpperCase().includes('PASSWORD') || fields.get(index).name.toUpperCase().includes('SECRET') || fields.get(index).name.toUpperCase().includes('KEY');
        const fieldNameStr = isInherited ? `${keyFieldName} (inherit)` : keyFieldName;
        const fieldValueStr = isInherited ? `${valueFieldName} (overridable)` : valueFieldValue;

        return (
          <div key={index} className={className}>
            <Field
              name={`${member}.${keyFieldValue}`}
              type="text"
              component={renderNameField}
              label={fieldNameStr}
              className="flex-4 flex-xs-12"
              disabled={isRequired || isInherited || disabled}
              keyFieldValidationMessage={keyFieldValidationMessage}
              keyFieldValidationFunction={keyFieldValidationFunction}
            />
            <Field
              name={`${member}.${valueFieldValue}`}
              type="text"
              component={isPassword ? renderPasswordField : renderValueField}
              label={fieldValueStr}
              className="flex-7 flex-xs-12"
              required={isRequired}
              valueFieldValidationMessage={valueFieldValidationMessage}
              valueFieldValidationFunction={valueFieldValidationFunction}
              hideValueField={hideValueField}
              disabled={props.disabled}
            />
            {!(isRequired || isInherited || disabled) &&
              <FieldRemoveButton
                marginTop="1em"
                onClick={() => fields.remove(index)}
              />}
          </div>
        );
      })}
    </div>
  );
};

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
  hideValueField: PropTypes.bool.isRequired,
  keyFieldValidationMessage: PropTypes.string.isRequired,
  keyFieldValidationFunction: PropTypes.func.isRequired,
  valueFieldValidationMessage: PropTypes.string.isRequired,
  valueFieldValidationFunction: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};

rendervariables.defaultProps = {
  touched: false,
  error: false,
  className: 'flex-row no-gutter',
  valueFieldValidationFunction: null,
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
    hideValueField={props.hideValueField}
    keyFieldValidationMessage={props.keyFieldValidationMessage}
    keyFieldValidationFunction={props.keyFieldValidationFunction}
    valueFieldValidationMessage={props.valueFieldValidationMessage}
    valueFieldValidationFunction={props.valueFieldValidationFunction}
    disabled={props.disabled}
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
  hideValueField: PropTypes.bool,
  keyFieldValidationMessage: PropTypes.string,
  keyFieldValidationFunction: PropTypes.func,
  valueFieldValidationMessage: PropTypes.string,
  valueFieldValidationFunction: PropTypes.func,
  disabled: PropTypes.bool,
};

FieldArraysForm.defaultProps = {
  fieldName: 'variables',
  addButtonLabel: 'Variable',
  icon: 'add_circle_outline',
  keyFieldName: 'Name',
  keyFieldValue: 'name',
  valueFieldName: 'Value',
  valueFieldValue: 'value',
  hideValueField: false,
  keyFieldValidationMessage: '',
  keyFieldValidationFunction: null,
  valueFieldValidationMessage: '',
  valueFieldValidationFunction: null,
  disabled: false,
};

export default FieldArraysForm;
