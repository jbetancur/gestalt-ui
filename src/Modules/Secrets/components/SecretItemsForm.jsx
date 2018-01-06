import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { isSecretKeyValidation, secretKeyValidationPattern } from 'util/validations';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const validatePattern = value => (value && !isSecretKeyValidation(value)) && `Allowed format: ${secretKeyValidationPattern}`;
const required = value => (value ? undefined : 'Required');

const SecretItemsForm = ({ fields, disabled }) => (
  <FieldContainer>
    <FieldItem>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={fields.push}
        disabled={disabled}
      >
        Add Secret Item
      </Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={index}>
        {!disabled && <RemoveButton onRemove={fields.remove} index={index} />}
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              name={`${member}.key`}
              label="key"
              type="text"
              component={TextField}
              validate={[validatePattern, required]}
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
              />
            </Col>}
        </Row>
      </FieldItem>
    ))}
  </FieldContainer>
);

SecretItemsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

SecretItemsForm.defaultProps = {
  disabled: false,
};

export default SecretItemsForm;
