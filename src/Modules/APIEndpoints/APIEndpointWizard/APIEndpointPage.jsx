import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import { Chips } from 'components/Lists';
import HTTPMethods from '../components/HTTPMethods';
import RateLimit from '../components/RateLimit';

const APIEndpointForm = ({ initialValues, implementationType, portMappings, pending }) => (
  <React.Fragment>
    {pending && <ActivityContainer primary centered id="apiendpoint-wizard--loading" />}

    <Row>
      {implementationType === 'container' &&
        <Panel title="Mapping" noShadow noPadding expandable={false}>
          <Row gutter={5}>
            <Col flex={6}>
              <Field
                id="container--properties.container_port_name"
                component={SelectField}
                name="properties.container_port_name"
                menuItems={portMappings}
                itemLabel="name"
                itemValue="name"
                label="Service Label"
                required
                helpText="the service mapping name"
              />
            </Col>
          </Row>
        </Panel>}
    </Row>

    <Row>
      {/* Left Column */}
      <Col flex={6} xs={12}>
        <Row gutter={5}>
          <Col flex={12}>
            <Panel title="Route Filtering" noShadow noPadding expandable={false}>
              <Row gutter={5} alignItems="baseline">
                <Col flex={12}>
                  <Field
                    component={TextField}
                    name="properties.resource"
                    label="Relative Path"
                    type="text"
                    helpText="a relative path is only required if there are no hosts: e.g. /path or /path1/path2"
                  />
                </Col>

                <Col flex={12}>
                  <Field
                    id="apiendpoints--hostnames"
                    label="Hostname"
                    addLabel="Add Host"
                    component={Chips}
                    name="properties.hosts"
                    ignorePrefixValidation
                    forceLowerCase
                    helpText="at least 1 host is required if a relative path is not specified: e.g. galacticfog.com"
                  />
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
      </Col>

      {/* Right Column */}
      <Col flex={6} xs={12}>
        <Row>
          <Col flex={12}>
            <Panel title="Options" noShadow noPadding expandable={false}>
              <Row gutter={5}>
                {implementationType === 'lambda' &&
                  <Col flex={12} xs={12}>
                    <Field
                      id="synchronous"
                      component={Checkbox}
                      name="properties.synchronous"
                      defaultChecked={initialValues.properties.synchronous}
                      label="Synchronous"
                      hasMargin={false}
                    />
                  </Col>}

                <Col flex={12}>
                  <Field
                    id="show-api-endpoints-security"
                    component={Checkbox}
                    name="properties.plugins.gestaltSecurity.enabled"
                    defaultChecked={initialValues.properties.plugins.gestaltSecurity && initialValues.properties.plugins.gestaltSecurity.enabled}
                    label="Require Authentication"
                    hasMargin={false}
                  />
                </Col>

                <Col flex={12}>
                  <RateLimit isToggled={initialValues.properties.plugins.rateLimit && initialValues.properties.plugins.rateLimit.enabled} />
                </Col>

                <Col flex={12}>
                  {/* <Subtitle>Allowed Methods</Subtitle> */}
                  <Caption light>* at least one http method is required</Caption>
                  <HTTPMethods />
                </Col>

              </Row>
            </Panel>
          </Col>
        </Row>
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
