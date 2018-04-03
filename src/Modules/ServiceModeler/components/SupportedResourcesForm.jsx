import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import { PropertyDefForm, LineageForm } from 'Modules/ResourceTypes';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const SupportedResourceForm = ({ fields, resourceTypes }) => (
  <FieldContainer>
    <FieldItem noBackground>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={() => fields.push({
          data_type: 'string',
          visibility_type: 'plain',
          requirement_type: 'optional'
        })}
      >
        Add Definition
      </Button>
    </FieldItem>
    {fields.map((member, index) => (
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title={`Resource Class Definition ${index + 1}`} noPadding>
            <FieldItem key={index}>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} absoluteTopRight tabIndex="-1" />
              <Row gutter={5}>
                <Col flex={4}>
                  <Field
                    name={`${member}.name`}
                    type="text"
                    component={TextField}
                    label="Name"
                    helpText="The name of this Resource Class"
                    required
                  />
                </Col>

                <Col flex={4}>
                  <Field
                    component={TextField}
                    name={`${member}.properties.actions.prefix`}
                    label="Action Prefix"
                    helpText="The Action Prefix is used to to Link Actions"
                    required
                  />
                </Col>

                <Col flex={4}>
                  <Field
                    component={TextField}
                    name={`${member}.properties.api.rest_name`}
                    label="Relative API Endpoint"
                    helpText="The Relative api endpoint that will be exposed (e.g. /todos)"
                    required
                  />
                </Col>

                <Col flex={12}>
                  <Field
                    component={TextField}
                    name={`${member}.description`}
                    label="Description"
                    rows={1}
                  />
                </Col>

                <Col flex={12}>
                  <FieldArray
                    name={`${member}.property_defs`}
                    component={PropertyDefForm}
                    resourceTypes={resourceTypes}
                    rerenderOnEveryChange
                  />
                </Col>
                <Col flex={12}>
                  <FieldArray
                    name={`${member}.properties.lineage.parent_types`}
                    component={LineageForm}
                    resourceTypes={resourceTypes}
                    addLabel="Link Parent"
                  />
                </Col>
              </Row>
            </FieldItem>
          </Panel>
        </Col>
      </Row>
    ))}
  </FieldContainer>
);

SupportedResourceForm.propTypes = {
  fields: PropTypes.object.isRequired,
  resourceTypes: PropTypes.array,
};

SupportedResourceForm.defaultProps = {
  resourceTypes: [],
};

export default SupportedResourceForm;
