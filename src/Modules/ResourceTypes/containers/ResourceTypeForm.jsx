import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { FullPageFooter } from 'components/FullPage';
import { Button } from 'components/Buttons';
import Form from 'components/Form';
import { Chips } from 'components/Lists';
import Fieldset from 'components/Fieldset';
import PropertyDefForm from '../components/PropertyDefFormNew';
import LineageForm from '../components/LineageFormNew';

const ResourceTypeForm = ({ match,
  values,
  handleSubmit,
  submitting,
  pristine,
  resourcetypesData,
  resourceType,
  pending,
  editMode,
}) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={pending}>
    <Row gutter={5}>
      <Col flex={7}>
        <Panel title="General" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                component={TextField}
                name="name"
                label="Resource Name"
                required
              />
            </Col>

            {!editMode &&
              <Col flex={12}>
                <Field
                  id="select-extends"
                  component={SelectField}
                  name="extend"
                  menuItems={['', ...resourcetypesData]}
                  itemLabel="name"
                  itemValue="id"
                  label="Extend Resource"
                  async
                  helpText="Resource Type to extend"
                />
              </Col>}

            <Col flex={12}>
              <Field
                id="abstract"
                component={Checkbox}
                name="properties.abstract"
                defaultChecked={resourceType.properties.abstract}
                label="Abstract"
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={5} xs={12} sm={12} md={12}>
        <Panel title="Description" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                placeholder="Description"
                rows={1}
                maxRows={6}
              />
            </Col>
          </Row>
        </Panel>
      </Col>


      <Col flex={12}>
        <Panel title="Tags">
          <Field
            id="resourcetypes--tags"
            label="Add a Tag"
            component={Chips}
            name="tags"
            ignorePrefixValidation
          />
        </Panel>
      </Col>

      <Col flex={6} xs={12}>
        <Panel title="API" minHeight="145px" fill>
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
        <Panel title="Actions" noPadding fill>
          <Row gutter={10}>
            <Col flex={12}>
              <Field
                name="properties.actions.prefix"
                component={TextField}
                label="Prefix"
                helpText="the action verb prefix"
              />
            </Col>
            <Col flex={12}>
              <Fieldset legend="Verbs">
                <Field
                  id="resourcetypes--verbs"
                  label="Verb"
                  component={Chips}
                  name="properties.actions.verbs"
                  ignorePrefixValidation
                  forceLowerCase
                />
              </Fieldset>
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={12}>
        <Panel title="Property Definitions" noPadding>
          <PropertyDefForm
            name="property_defs"
            resourceTypes={resourcetypesData}
            formValues={values}
          />
        </Panel>
      </Col>

      <Col flex={12}>
        <Panel title="Parent Lineage" noPadding>
          <LineageForm
            name="properties.lineage.parent_types"
            resourceTypes={resourcetypesData}
            addLabel="Add Parent"
          />
        </Panel>
      </Col>

      <Col flex={12}>
        <Panel title="Child Lineage" noPadding>
          <LineageForm
            name="properties.lineage.child_types"
            resourceTypes={resourcetypesData}
            addLabel="Add Child"
          />
        </Panel>
      </Col>
    </Row>

    <FullPageFooter>
      <Button
        flat
        iconChildren="arrow_back"
        disabled={pending || submitting}
        component={Link}
        to={`/${match.params.fqon}/resourcetypes`}
      >
        Resource Types
      </Button>
      <Button
        primary
        raised
        iconChildren="save"
        type="submit"
        disabled={submitting || pristine || pending}
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

ResourceTypeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  resourcetypesData: PropTypes.array.isRequired,
  pending: PropTypes.bool,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  resourceType: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

ResourceTypeForm.defaultProps = {
  pending: false,
};

export default ResourceTypeForm;
