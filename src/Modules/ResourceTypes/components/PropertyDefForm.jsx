import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { Caption } from 'components/Typography';
import dataTypes from '../lists/dataTypes';
import FieldContainer from './FieldContainer';
import FieldItem from './FieldItem';
import RemoveButton from './RemoveButton';

const PropertyDefForm = ({ fields }) => (
  <FieldContainer>
    <FieldItem>
      <Caption block light>At least 1 property definition is required</Caption>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={() => fields.push({ visibility_type: 'plain', requirement_type: 'optional' })}
      >
      Add Property
      </Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={index}>
        <RemoveButton onClick={() => fields.remove(index)} />
        <Row gutter={5}>
          <Col flex={6} xs={12} sm={12}>
            <Field
              name={`${member}.name`}
              type="text"
              component={TextField}
              label="Name"
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4}>
            <Field
              id={`${member}.data_type`}
              name={`${member}.data_type`}
              component={SelectField}
              menuItems={dataTypes}
              itemLabel="name"
              itemValue="name"
              label="Data Type"
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4}>
            <Field
              id={`${member}.visibility_type`}
              name={`${member}.visibility_type`}
              component={SelectField}
              label="Visibility Type"
              menuItems={['plain']}
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4}>
            <Field
              id={`${member}.requirement_type`}
              name={`${member}.requirement_type`}
              component={SelectField}
              label="Requirement Type"
              menuItems={['optional', 'required']}
              required
            />
          </Col>

          {/* <Col flex={1} xs={12} sm={12}>
            <Field
              id={`${member}.is_sealed`}
              name={`${member}.is_sealed`}
              component={Checkbox}
              label="Sealed"
            />
          </Col> */}

          {/* <Col flex={1} xs={12} sm={12}>
            <Field
              id={`${member}.is_system`}
              name={`${member}.is_system`}
              component={Checkbox}
              label="System"
            />
          </Col> */}
        </Row>
      </FieldItem>
    ))}
  </FieldContainer>
);

PropertyDefForm.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default PropertyDefForm;
