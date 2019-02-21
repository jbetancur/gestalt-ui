import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
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
            const overridden = isInherited && field.overridden;
            const isDisabled = isInherited || field.required;
            const isPasswordField = checkIfPassword(field.name);

            return (
              <FieldItem key={`variable-${member}`}>
                <Row gutter={5}>
                  <Col flex={4} xs={12} sm={12}>
                    <Field
                      id={`${member}.name`}
                      name={`${member}.name`}
                      placeholder="name"
                      rows={isPasswordField ? undefined : 1}
                      maxRows={isPasswordField ? undefined : 4}
                      component={TextField}
                      disabled={isDisabled}
                      autoComplete="off"
                      required
                      validate={composeValidators(unixPattern(), required())}
                      toolTip={isInherited ? 'inherited' : null}
                    />
                  </Col>
                  <Col flex={8} xs={12} sm={12}>
                    <Field
                      id={`${member}.value`}
                      name={`${member}.value`}
                      placeholder="value"
                      type={isPasswordField ? 'password' : 'text'}
                      component={TextField}
                      rows={isPasswordField ? undefined : 1}
                      maxRows={isPasswordField ? undefined : 4}
                      required={field.required}
                      passwordIcon={null}
                      validate={field.required ? composeValidators(required()) : null}
                      autoComplete={isPasswordField ? 'new-password' : null}
                      toolTip={overridden ? 'overridden value' : null}
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
