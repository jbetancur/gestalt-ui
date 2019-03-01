import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { Checkbox, SelectField, TextField } from 'components/Form';
import { Chips } from 'components/Lists';
import Fieldset from 'components/Fieldset';
import PropertyDefForm from '../components/PropertyDefForm';
import LineageForm from '../components/LineageForm';

const ResourceTypeForm = ({
  values,
  resourcetypesData,
  editMode,
}) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="General" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              component={TextField}
              name="name"
              label="Resource Name"
              required
            />
          </Col>
          <Col flex={6} xs={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              label="Description"
              multiline
              rowsMax={6}
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
              type="checkbox"
              name="properties.abstract"
              label="Abstract"
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
);

ResourceTypeForm.propTypes = {
  resourcetypesData: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
};

export default ResourceTypeForm;
