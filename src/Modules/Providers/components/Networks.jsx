import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required } from 'util/forms';

const Networks = ({ fieldName }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        {fields.map((member, index) => (
          <FieldItem key={`networks-${member}`}>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  name={`${member}.name`}
                  type="text"
                  component={TextField}
                  label="Name"
                  validate={composeValidators(required())}
                  required
                />
              </Col>
            </Row>
            <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
          </FieldItem>
        ))}
        <Row gutter={5} center>
          <Col flex={12}>
            <AddButton label="Add Network" onClick={() => fields.push({})} />
          </Col>
        </Row>
      </FieldContainer>
    )}
  </FieldArray>
);

Networks.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default Networks;
