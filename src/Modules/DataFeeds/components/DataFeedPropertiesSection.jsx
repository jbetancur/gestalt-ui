import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, AceEditor } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Chips } from 'components/Lists';
import feedTypes from '../lists/feedTypes';

const getFormats = (values) => {
  if (values && values.properties && values.properties.kind) {
    const feed = feedTypes.find(f => f.type === values.properties.kind);
    return feed ? feed.formats : [];
  }

  return [];
};

const getMode = (values) => {
  if (values && values.properties && values.properties.data.format) {
    return values.properties.data.format.toUpperCase().includes('JSON') ? 'json' : 'text';
  }

  return null;
};

const showEditor = (values) => {
  if (values && values.properties && values.properties.data.format) {
    return values.properties.data.format.toUpperCase().includes('INLINE');
  }

  return false;
};

const DataFeedPropertiesSection = ({ formValues, secrets }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="Data" expandable={false}>
        <Row gutter={5}>
          <Col flex={3} xs={12}>
            <Field
              id="datafeed-type"
              name="properties.kind"
              label="Type"
              component={SelectField}
              itemLabel="displayName"
              itemValue="type"
              menuItems={feedTypes}
              required
            />
          </Col>

          <Col flex={3} xs={12}>
            <Field
              id="datafeed-format"
              name="properties.data.format"
              label="Format"
              component={SelectField}
              menuItems={getFormats(formValues)}
            />
          </Col>

          <Col flex={6} xs={12}>
            <Field
              name="properties.data.endpoint"
              label="URI/Endpoint"
              component={TextField}
              required
            />
          </Col>

          <Col flex={6} xs={12}>
            <Field
              name="properties.data.topic"
              label="Topic"
              component={TextField}
              required
            />
          </Col>
          <Col flex={6} xs={12}>
            <Field
              name="properties.data.group"
              label="Group"
              component={TextField}
            />
          </Col>
        </Row>

        <Row gutter={5}>
          {showEditor(formValues) &&
            <Col flex={12}>
              <Field
                component={AceEditor}
                mode={getMode(formValues)}
                name="properties.data.data"
                maxLines={75}
                minLines={5}
              />
            </Col>}
        </Row>
      </Panel>
    </Col>

    {formValues.properties.kind === 'kafka' &&
      <Col flex={6} xs={12} sm={12}>
        <Panel title="Secret" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="datafeed-secret"
                name="properties.credentials.secret_id"
                label="Secret"
                itemLabel="name"
                itemValue="id"
                component={SelectField}
                menuItems={['', ...secrets]}
                simplifiedMenu={false}
                async
                helpText="select an optional secret for authentication"
              />
            </Col>
          </Row>
        </Panel>
      </Col>}

    <Col flex={6} xs={12} sm={12}>
      <Panel title="Classification" expandable={false} fill>
        <Row gutter={5}>
          <Field
            label="Data Classification"
            addLabel="Add Classification"
            component={Chips}
            name="properties.data.classification"
            ignorePrefixValidation
          />
        </Row>
      </Panel>
    </Col>
  </Row>
);

DataFeedPropertiesSection.propTypes = {
  formValues: PropTypes.object.isRequired,
  secrets: PropTypes.array.isRequired,
};

export default DataFeedPropertiesSection;
