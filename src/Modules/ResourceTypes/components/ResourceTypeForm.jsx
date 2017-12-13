import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardContent } from 'components/Cards';
import { Panel } from 'components/Panels';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import PropertyDefForm from './PropertyDefForm';
import LineageForm from './LineageForm';
import { nameMaxLen, descriptionMaxLen } from '../validations';

const ResourceTypeForm = (props) => {
  const { handleSubmit, submitting, invalid, pristine, resourceTypes, onSubmit } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <Card>
            <CardTitle>
              Create Resource Type
            </CardTitle>
            <ActionsToolbar>
              <Button
                flat
                iconChildren="arrow_back"
                disabled={props.resourceTypePending || props.submitting}
                component={Link}
                to="/root/resourcetypes"
              >
                Resource Types
              </Button>
              <Button
                primary
                raised
                iconChildren="save"
                type="submit"
                disabled={submitting || invalid || pristine || props.resourceTypePending}
              >
                Create
              </Button>
            </ActionsToolbar>
            <CardContent>
              <Row gutter={5}>
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Name"
                    maxLength={nameMaxLen}
                    required
                    helpText="The Name will be appended to Extends Resource"
                  />
                </Col>

                <Col flex={4} xs={12} sm={12}>
                  <Field
                    id="select-extends"
                    component={SelectField}
                    name="extends"
                    menuItems={resourceTypes}
                    itemLabel="name"
                    itemValue="id"
                    required
                    label="Extends Resource"
                    async
                    helpText="Resource Type to extend"
                  />
                </Col>

                <Col flex={3} xs={12} sm={12}>
                  <Field
                    component={TextField}
                    name="properties.api.rest_name"
                    label="Registered API Endpoint"
                    required
                  />
                </Col>

                <Col flex={1} xs={12} sm={12}>
                  <Field
                    id="abstract"
                    component={Checkbox}
                    name="properties.abstract"
                    label="Abstract"
                  />
                </Col>

                <Col flex={12}>
                  <Panel title="Description">
                    <Field
                      component={TextField}
                      name="description"
                      placeholder="Description"
                      rows={1}
                      maxLength={descriptionMaxLen}
                    />
                  </Panel>
                </Col>

                <Col flex={12}>
                  <Panel title="Property Definitions" noPadding>
                    <FieldArray name="properties.property_defs" component={PropertyDefForm} />
                  </Panel>
                </Col>

                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Parent Resource Types" noPadding>
                    <FieldArray name="properties.lineage.parent_types" component={LineageForm} resourceTypes={resourceTypes} />
                  </Panel>
                </Col>

                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Child Resource Types" noPadding>
                    <FieldArray name="properties.lineage.child_types" component={LineageForm} resourceTypes={resourceTypes} />
                  </Panel>
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </form>
  );
};

ResourceTypeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resourceTypes: PropTypes.array.isRequired,
  resourceTypePending: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default ResourceTypeForm;
