import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSpy } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/Form';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import { Chips } from 'components/Lists';
import HTTPMethods from '../components/HTTPMethods';
import RateLimit from '../components/RateLimit';

const APIEndpointForm = ({ implementationType, portMappings, pending }) => (
  <FormSpy>
    {({ values }) => (
      <React.Fragment>
        {pending && <ActivityContainer primary centered id="apiendpoint-wizard--loading" />}

        <Row>
          {/* Left Column */}
          <Col flex={6} xs={12}>
            {implementationType === 'container' && (
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Service Port Mapping" noShadow noPadding expandable={false}>
                    <Row gutter={5}>
                      <Col flex={12}>
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
                  </Panel>
                </Col>
              </Row>
            )}

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
                      <Caption light>* at least one http method is required</Caption>
                      <HTTPMethods />
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
                  {implementationType === 'lambda' &&
                    <Row gutter={5}>
                      <Col flex={12}>
                        <Field
                          id="synchronous"
                          component={Checkbox}
                          type="checkbox"
                          name="properties.synchronous"
                          label="Synchronous"
                        />
                      </Col>

                      <Col flex={12}>
                        <Field
                          id="is_http_aware"
                          component={Checkbox}
                          type="checkbox"
                          name="properties.is_http_aware"
                          label="Lambda managed HTTP response"
                        />
                      </Col>
                    </Row>}

                  <Row gutter={5}>
                    <Col flex={12}>
                      <Field
                        id="show-api-endpoints-security"
                        component={Checkbox}
                        type="checkbox"
                        name="properties.plugins.gestaltSecurity.enabled"
                        label="Require Authentication"
                      />
                    </Col>

                    <Col flex={12}>
                      <RateLimit isToggled={values.properties.plugins.rateLimit && values.properties.plugins.rateLimit.enabled} />
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    )}
  </FormSpy>
);

APIEndpointForm.propTypes = {
  portMappings: PropTypes.array,
  implementationType: PropTypes.string.isRequired,
  pending: PropTypes.bool,
};

APIEndpointForm.defaultProps = {
  portMappings: [],
  pending: false,
};

export default APIEndpointForm;
