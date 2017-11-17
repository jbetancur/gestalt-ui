import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { Field, FieldArray } from 'redux-form';
import { TextField } from 'components/ReduxFormFields';
import { Button, FieldRemoveButton } from 'components/Buttons';
import PreventAutoFill from 'components/PreventAutoFill';

const PasswordTextField = styled(TextField)`
  button {
    pointer-events: none;
  }
`;

const checkIfPassword = field =>
  field && field.length && (field.toUpperCase().includes('PASSWORD') || field.toUpperCase().includes('SECRET') || field.toUpperCase().includes('KEY'));

const renderNameField = (props) => {
  // eslint-disable-next-line react/prop-types
  const { input, label, type, className, disabled, required, keyFieldValidationMessage, keyFieldValidationFunction } = props;
  const doValidate =
    (keyFieldValidationMessage && keyFieldValidationFunction && typeof keyFieldValidationFunction === 'function');
  const validateKey = value => (value && !keyFieldValidationFunction(value)) && keyFieldValidationMessage;

  return (
    <Field
      {...input}
      className={className}
      label={label}
      placeholder={label}
      component={TextField}
      type={type}
      required={required}
      disabled={disabled}
      rows={1}
      validate={doValidate && validateKey}
      autoComplete="off"
      value=" "
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
      required={required}
      disabled={disabled}
      rows={1}
      validate={doValidate && validateValue}
      autoComplete="off"
      value=" "
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
    !hideValueField && [
      <PreventAutoFill key={`${name}--preventautofill`} />,
      <Field
        {...input}
        key={name}
        className={className}
        label={label}
        component={PasswordTextField}
        style={{ marginTop: '14px' }}
        type="password"
        required={required}
        disabled={disabled}
        validate={doValidate && validateValue}
        passwordIcon={null}
        autoComplete="off"
        value=" "
      />]
  );
};


const rendervariables = (props) => {
  const {
    fields,
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
    disabled,
  } = props;

  const addItem = () => {
    fields.push({});
  };

  return (
    <div>
      <Button
        flat
        iconChildren={icon}
        primary
        onClick={addItem}
        disabled={disabled}
      >
        {addButtonLabel}
      </Button>
      {fields.map((member, index) => {
        const field = fields.get(index);
        const isRequired = field.required;
        const isInherited = field.inherited;
        const isPassword = checkIfPassword(fields.get(index).name);
        const fieldNameStr = isInherited ? `${keyFieldName} (inherit)` : keyFieldName;
        const fieldValueStr = isInherited ? `${valueFieldName} (overridable)` : valueFieldValue;
        const isDisabled = isRequired || isInherited || disabled;
        const valueComponent = isPassword ? renderPasswordField : renderValueField;

        return (
          <Row key={index} gutter={5} className={className}>
            <Col flex={4} xs={12}>
              <Field
                name={`${member}.${keyFieldValue}`}
                type="text"
                component={renderNameField}
                label={fieldNameStr}
                disabled={isDisabled}
                keyFieldValidationMessage={keyFieldValidationMessage}
                keyFieldValidationFunction={keyFieldValidationFunction}
              />
            </Col>
            <Col flex={7} xs={12}>
              <Field
                name={`${member}.${valueFieldValue}`}
                type="text"
                component={valueComponent}
                label={fieldValueStr}
                required={isRequired}
                valueFieldValidationMessage={valueFieldValidationMessage}
                valueFieldValidationFunction={valueFieldValidationFunction}
                hideValueField={hideValueField}
                disabled={props.disabled}
              />
            </Col>
            {!isDisabled &&
              <FieldRemoveButton
                marginTop="1em"
                onClick={() => fields.remove(index)}
              />}
          </Row>
        );
      })}
    </div>
  );
};

rendervariables.propTypes = {
  fields: PropTypes.object.isRequired,
  addButtonLabel: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  keyFieldName: PropTypes.string.isRequired,
  keyFieldValue: PropTypes.string.isRequired,
  valueFieldName: PropTypes.string.isRequired,
  valueFieldValue: PropTypes.string.isRequired,
  hideValueField: PropTypes.bool.isRequired,
  keyFieldValidationMessage: PropTypes.string.isRequired,
  keyFieldValidationFunction: PropTypes.func,
  valueFieldValidationMessage: PropTypes.string.isRequired,
  valueFieldValidationFunction: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};

rendervariables.defaultProps = {
  className: '',
  keyFieldValidationFunction: null,
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
