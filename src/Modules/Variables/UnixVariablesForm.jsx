import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/Form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { checkIfPassword } from 'util/helpers/strings';
import { composeValidators, required, unixPattern } from 'util/forms';

const UnixVariablesForm = memo(({ fieldName }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => {
      const addNew = () => {
        fields.push({});
      };

      return (
        <FieldContainer>
          {fields.map((member, index) => {
            const field = fields.value[index] || {};
            const isInherited = field.inherited;
            const overridden = isInherited && field.overridden ? 'value (overridden)' : 'value (inherited)';
            const isDisabled = isInherited || field.required;
            const isPasswordField = checkIfPassword(field.name);

            return (
              <FieldItem key={`variable-${member}`}>
                <Row gutter={5}>
                  <Col flex={4} xs={12} sm={12}>
                    <Field
                      id={`${member}.name`}
                      name={`${member}.name`}
                      label={isInherited ? 'name (inherited)' : 'name'}
                      component={TextField}
                      disabled={isDisabled}
                      autoComplete="off"
                      required
                      validate={composeValidators(unixPattern(), required())}
                      variant="outlined"
                    />
                  </Col>
                  <Col flex={8} xs={12} sm={12}>
                    <Field
                      id={`${member}.value`}
                      name={`${member}.value`}
                      label={(isInherited && overridden && overridden) || 'value'}
                      type={isPasswordField ? 'password' : 'text'}
                      component={TextField}
                      multiline={!isPasswordField}
                      rowsMax={isPasswordField ? undefined : 4}
                      required={field.required}
                      validate={field.required ? composeValidators(required()) : null}
                      autoComplete={isPasswordField ? 'new-password' : null}
                      variant="outlined"
                    />
                  </Col>
                </Row>
                {(!isDisabled && !field.required) && <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />}
              </FieldItem>
            );
          })}
          <Row gutter={5} center>
            <Col flex={12}>
              <AddButton label="Add Variable" onClick={addNew} />
            </Col>
          </Row>
        </FieldContainer>
      );
    }}
  </FieldArray>
));

UnixVariablesForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default UnixVariablesForm;
