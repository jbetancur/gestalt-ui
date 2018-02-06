import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { isUnixVariable } from 'util/validations';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const validatePattern = value => (value && !isUnixVariable(value)) && 'Invalid Label Name';
const required = value => (value ? undefined : 'Required');

const LabelsForm = ({ fields }) => (
  <FieldContainer>
    <FieldItem>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={fields.push}
      >
        Add Label
      </Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={index}>
        <RemoveButton onRemove={fields.remove} index={index} tabindex="-1" />
        <Row gutter={5}>
          <Col flex={4} xs={12} sm={12}>
            <Field
              name={`${member}.name`}
              label="name"
              type="text"
              component={TextField}
              validate={[validatePattern, required]}
              autoComplete="off"
            />
          </Col>
          <Col flex={8} xs={12} sm={12}>
            <Field
              name={`${member}.value`}
              label="value"
              type="text"
              component={TextField}
              autoComplete="off"
            />
          </Col>
        </Row>
      </FieldItem>
    ))}
  </FieldContainer>
);

LabelsForm.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default LabelsForm;
