import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { isSecretKeyValidation, secretKeyValidationPattern } from 'util/validations';
import { TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required } from 'util/forms';

const validatePattern = value => (value && !isSecretKeyValidation(value)) && `Allowed format: ${secretKeyValidationPattern}`;

const SecretItemsForm = ({ fieldName, multiPart, disabled }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        {multiPart && <AddButton label="Add Item" onClick={() => fields.unshift({})} disabled={disabled} />}
        {fields.map((member, index) => (
          <FieldItem key={`secrets-${member}`}>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  name={`${member}.key`}
                  label="key"
                  type="text"
                  component={TextField}
                  validate={composeValidators(validatePattern, required())}
                  autoComplete="off"
                  disabled={disabled}
                />
              </Col>
              {!disabled &&
              <Col flex={12}>
                <Field
                  name={`${member}.value`}
                  label="value"
                  type="text"
                  component={TextField}
                  autoComplete="off"
                  rows={1}
                  validate={composeValidators(required())}
                />
              </Col>}
            </Row>
            {(!disabled && multiPart) && <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />}
          </FieldItem>
        ))}
      </FieldContainer>
    )}
  </FieldArray>
);

SecretItemsForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  multiPart: PropTypes.bool,
};

SecretItemsForm.defaultProps = {
  disabled: false,
  multiPart: false,
};

export default SecretItemsForm;
