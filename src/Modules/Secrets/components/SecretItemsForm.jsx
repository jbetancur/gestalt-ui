import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { FileButton } from 'components/Buttons';
import { isSecretKeyValidation, secretKeyValidationPattern } from 'util/validations';
import { TextField } from 'components/Form';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required } from 'util/forms';

const validatePattern = value => (value && !isSecretKeyValidation(value)) && `Allowed format: ${secretKeyValidationPattern}`;
const initialValues = { key: '', value: '' };
const supportedFormats = '';
const maxSize = 128000;
const maxSizeKB = maxSize / 1000;

const onFile = (file, index, form, formValues) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (file.size > maxSize) {
      // eslint-disable-next-line no-alert
      window.alert(`Maximum file size allowed: ${maxSizeKB}KB`);
    } else {
      form.change('properties.items', Object.assign([], formValues.properties.items, { [index]: { key: formValues.properties.items[index].key, value: reader.result.split(',')[1], isFile: true, } }));
    }
  };

  reader.onerror = (error) => {
    // eslint-disable-next-line no-alert
    window.alert(error);
  };
};

const SecretItemsForm = ({ fieldName, multiPart, disabled, formValues, form }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        {fields.map((member, index) => (
          <FieldItem key={`secrets-${member}`}>
            <Row gutter={5} alignItems="center">
              <Col flex={4} xs={12}>
                <Field
                  name={`${member}.key`}
                  label="key"
                  type="text"
                  component={TextField}
                  validate={composeValidators(validatePattern, required())}
                  autoComplete="off"
                  disabled={disabled}
                  multiline
                  rowsMax={4}
                />
              </Col>
              {!disabled &&
                <Col flex={6} xs={12}>
                  <Field
                    name={`${member}.value`}
                    label="value"
                    type="text"
                    component={TextField}
                    autoComplete="off"
                    multiline
                    rowsMax={4}
                    validate={composeValidators(required())}
                    placeholder={`file uploads will be base64 encoded. max size allowed ${maxSizeKB}KB`}
                  />
                </Col>}

              {!disabled &&
                <Col flex={2}>
                  <FileButton
                    id={`${member}-upload`}
                    label="Upload File"
                    onChange={file => onFile(file, index, form, formValues)}
                    accept={supportedFormats}
                  />
                </Col>}
            </Row>
            {(!disabled && multiPart && fields.length > 1) && <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />}
          </FieldItem>
        ))}
        {multiPart && !disabled &&
          <Row gutter={5} center>
            <Col flex={12}>
              <AddButton label="Add Item" disabled={disabled} onClick={() => fields.push(initialValues)} />
            </Col>
          </Row>}
      </FieldContainer>
    )}
  </FieldArray>
);

SecretItemsForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  multiPart: PropTypes.bool,
};

SecretItemsForm.defaultProps = {
  disabled: false,
  multiPart: false,
};

export default SecretItemsForm;
