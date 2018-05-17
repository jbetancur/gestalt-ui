import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import Security from '../components/Security';
import HTTPMethods from '../components/HTTPMethods';
import RateLimit from '../components/RateLimit';

const APIEndpointForm = ({ initialValues, implementationType, portMappings, pending }) => (
  <React.Fragment>
    {pending && <ActivityContainer primary centered id="apiendpoint-wizard--loading" />}
    <Row gutter={5}>
      <Col flex={6} xs={12}>
        <Field
          component={TextField}
          name="properties.resource"
          label="Relative Path"
          type="text"
          helpText="e.g. /path or /path1/path2"
          required
        />
      </Col>

      {implementationType === 'lambda' &&
        <Col flex={3} xs={12}>
          <Field
            id="synchronous"
            component={Checkbox}
            name="properties.synchronous"
            defaultChecked={initialValues.properties.synchronous}
            label="Sync"
          />
          <Caption light>sync waits for a return response</Caption>
        </Col>}

      <Col flex={3} xs={12}>
        <RateLimit isToggled={initialValues.properties.plugins.rateLimit && initialValues.properties.plugins.rateLimit.enabled} />
      </Col>
    </Row>

    {implementationType === 'container' &&
      <Row gutter={5}>
        <Col flex={6} xs={12}>
          <Field
            id="container--properties.container_port_name"
            component={SelectField}
            name="properties.container_port_name"
            menuItems={portMappings}
            itemLabel="name"
            itemValue="name"
            label="Container Port Name"
            required
            helpText="Ensure that you created a container port mapping"
          />
        </Col>
      </Row>}

    <Row gutter={5}>
      <Col flex={6} xs={12}>
        <Panel title="Allowed HTTP Methods" noShadow expandable={false}>
          <HTTPMethods />
        </Panel>
      </Col>
      <Col flex={6} xs={12}>
        <Panel title="Security" noShadow expandable={false}>
          <Security isToggled={initialValues.properties.plugins.gestaltSecurity && initialValues.properties.plugins.gestaltSecurity.enabled} />
        </Panel>
      </Col>
    </Row>
  </React.Fragment>
);

APIEndpointForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  portMappings: PropTypes.array,
  implementationType: PropTypes.string.isRequired,
  pending: PropTypes.bool,
};

APIEndpointForm.defaultProps = {
  portMappings: [],
  pending: false,
};

export default APIEndpointForm;
