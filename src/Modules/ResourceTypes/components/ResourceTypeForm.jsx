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
import ActionVerbsForm from './ActionVerbsForm';
import { nameMaxLen, descriptionMaxLen } from '../validations';

const ResourceTypeForm = (props) => {
  const { title, handleSubmit, submitting, pristine, resourceTypes, onSubmit, resourceType, editMode } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <Card>
            <CardTitle title={title} subTitle={resourceType.extend && `extends: ${resourceType.extend}`} />
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
                disabled={submitting || pristine || props.resourceTypePending}
              >
                {editMode ? 'Update' : 'Create'}
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
                  />
                </Col>

                {!editMode &&
                  <Col flex>
                    <Field
                      id="select-extends"
                      component={SelectField}
                      name="extend"
                      menuItems={resourceTypes}
                      itemLabel="name"
                      itemValue="id"
                      required
                      label="Extend Resource"
                      async
                      helpText="Resource Type to extend"
                    />
                  </Col>}

                <Col flex={1} xs={12} sm={12}>
                  <Field
                    id="abstract"
                    component={Checkbox}
                    name="properties.abstract"
                    defaultChecked={resourceType.properties.abstract}
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

                <Col flex={6} xs={12}>
                  <Panel title="API" minHeight="145px">
                    <Row gutter={5}>
                      <Col flex={12}>
                        <Field
                          component={TextField}
                          name="properties.api.rest_name"
                          label="Registered API Endpoint"
                          helpText="a valid resource path"
                        />
                      </Col>
                    </Row>
                  </Panel>
                </Col>

                <Col flex={6} xs={12}>
                  <Panel title="Actions" noPadding>
                    <Row gutter={10}>
                      <Col flex={12}>
                        <Field
                          name="properties.actions.prefix"
                          component={TextField}
                          label="Prefix"
                          helpText="the action verb prefix"
                        />
                      </Col>
                    </Row>
                    <FieldArray
                      name="properties.actions.verbs"
                      component={ActionVerbsForm}
                    />
                  </Panel>
                </Col>

                <Col flex={12}>
                  <Panel title="Property Definitions" noPadding>
                    <FieldArray
                      name="property_defs"
                      component={PropertyDefForm}
                      resourceTypes={resourceTypes}
                    />
                  </Panel>
                </Col>

                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Parent Lineage" noPadding>
                    <FieldArray
                      name="properties.lineage.parent_types"
                      component={LineageForm}
                      resourceTypes={resourceTypes}
                    />
                  </Panel>
                </Col>

                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Child Lineage" noPadding>
                    <FieldArray
                      name="properties.lineage.child_types"
                      component={LineageForm}
                      resourceTypes={resourceTypes}
                    />
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
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resourceTypes: PropTypes.array.isRequired,
  resourceTypePending: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  resourceType: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
};

export default ResourceTypeForm;
