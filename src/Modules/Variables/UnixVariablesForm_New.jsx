import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Field } from 'react-final-form';
import { getIn } from 'final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { checkIfPassword } from 'util/helpers/strings';
import { composeValidators, required, unixPattern } from 'util/forms';

const UnixVariablesFormNew = ({ disabled, fieldName, formValues }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        <AddButton label="Add Variable" onClick={() => fields.unshift({})} />
        {fields.map((member, index) => {
          const field = getIn(formValues, member) || {};
          const isInherited = field.inherited;
          const fieldNameStr = isInherited ? 'name (inherit)' : 'name';
          const fieldValueStr = isInherited ? 'value (overridable)' : 'value';
          const isDisabled = isInherited || disabled;
          const isPasswordField = checkIfPassword(field.name);

          return (
            <FieldItem key={`variable-${member}`}>
              <Row gutter={5}>
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    id={`${member}.name`}
                    name={`${member}.name`}
                    placeholder={fieldNameStr}
                    rows={isPasswordField ? undefined : 1}
                    maxRows={isPasswordField ? undefined : 4}
                    component={TextField}
                    disabled={isDisabled}
                    autoComplete="off"
                    required
                    helpText={isInherited ? 'inherited' : null}
                    validate={composeValidators(unixPattern())}
                  />
                </Col>
                <Col flex={8} xs={12} sm={12}>
                  <Field
                    id={`${member}.value`}
                    name={`${member}.value`}
                    placeholder={fieldValueStr}
                    type={isPasswordField ? 'password' : 'text'}
                    component={TextField}
                    rows={isPasswordField ? undefined : 1}
                    maxRows={isPasswordField ? undefined : 4}
                    required={field.required}
                    passwordIcon={null}
                    helpText={isInherited ? 'overridable' : null}
                    validate={field.required ? composeValidators(required()) : null}
                    autoComplete={isPasswordField ? 'new-password' : null}
                  />
                </Col>
              </Row>
              {(!isDisabled && !member.required) && <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />}
            </FieldItem>
          );
        })}
      </FieldContainer>
    )}
  </FieldArray>
);

UnixVariablesFormNew.propTypes = {
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
};

UnixVariablesFormNew.defaultProps = {
  disabled: false,
};

export default UnixVariablesFormNew;
