import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, AceEditor, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
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

const DataFeedPropertiesSection = ({ formValues }) => (
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

    <Col flex={12}>
      <Panel title="Classification" expandable={false}>
        <Row gutter={5}>
          {['Client Data', 'PII', 'HIPPA'].map(item => (
            <Col flex={2} xs={12} sm={6} md={4} key={item}>
              <Field
                key={item}
                id={item}
                label={item}
                component={Checkbox}
                name="properties.data.classification"
                style={{ margin: 0 }}
              />
            </Col>))}
        </Row>
      </Panel>
    </Col>

    {/* <Col flex={12}>
      <Panel title="Secret" defaultExpanded={!!formValues.properties.data.secret}>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              id="datafeed-secret"
              name="properties.data.secret"
              label="Secret"
              itemLabel="name"
              itemValue="id"
              component={SelectField}
              menuItems={secrets}
              async
            />
          </Col>
        </Row>
      </Panel>
    </Col> */}
  </Row>
);

DataFeedPropertiesSection.propTypes = {
  formValues: PropTypes.object.isRequired,
  // secrets: PropTypes.array.isRequired,
};

export default DataFeedPropertiesSection;
