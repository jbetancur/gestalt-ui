import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { getIn } from 'final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required, hasSpaces } from 'util/forms';
import dataTypes from '../lists/dataTypes';

const initialValues = { data_type: 'string', visibility_type: 'plain', requirement_type: 'optional', public: true };

const PropertyDefForm = ({ name, resourceTypes, addLabel, formValues }) => (
  <FieldArray name={name}>
    {({ fields }) => (
      <FieldContainer>
        {fields.map((member, index) => {
          const field = getIn(formValues, member) || {};
          const isResourceType = field.data_type && field.data_type.includes('resource::uuid');

          return (
            <FieldItem key={`property-${member}`}>
              <Row gutter={5}>
                <Col flex={6} xs={12} sm={12}>
                  <Field
                    name={`${member}.name`}
                    type="text"
                    component={TextField}
                    label="Name"
                    validate={composeValidators(required(), hasSpaces())}
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
                    validate={composeValidators(required())}
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

                {isResourceType &&
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
                      validate={isResourceType ? composeValidators(required()) : null}

                    />
                  </Col>}
              </Row>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
            </FieldItem>
          );
        })}
        <Row gutter={5} center>
          <Col flex={12}>
            <AddButton label={addLabel} onClick={() => fields.push(initialValues)} />
          </Col>
        </Row>
      </FieldContainer>
    )}
  </FieldArray>
);

PropertyDefForm.propTypes = {
  name: PropTypes.string.isRequired,
  resourceTypes: PropTypes.array.isRequired,
  addLabel: PropTypes.string,
  formValues: PropTypes.object.isRequired,
};

PropertyDefForm.defaultProps = {
  addLabel: 'Add Property'
};

export default PropertyDefForm;
