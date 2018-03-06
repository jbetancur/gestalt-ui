import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';
import { Button } from 'components/Buttons';
import dataTypes from '../lists/dataTypes';

const PropertyDefForm = ({ fields, resourceTypes, addLabel }) => (
  <FieldContainer>
    <FieldItem>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={() => fields.push({ data_type: 'string', visibility_type: 'plain', requirement_type: 'optional', public: true })}
      >
        {addLabel}
      </Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={member}>
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
              menuItems={['plain', 'hidden']}
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

          {fields.get(index).data_type && fields.get(index).data_type.includes('resource::uuid') &&
            <Col flex={8} xs={12} sm={12}>
              <Field
                id={`${member}.refers_to`}
                name={`${member}.refers_to`}
                component={SelectField}
                menuItems={resourceTypes}
                itemLabel="name"
                itemValue="name"
                label="Refers To"
                async
              />
            </Col>}
        </Row>
        <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
      </FieldItem>
    ))}
  </FieldContainer>
);

PropertyDefForm.propTypes = {
  fields: PropTypes.object.isRequired,
  resourceTypes: PropTypes.array.isRequired,
  addLabel: PropTypes.string,
};

PropertyDefForm.defaultProps = {
  addLabel: 'Add Property'
};

export default PropertyDefForm;
