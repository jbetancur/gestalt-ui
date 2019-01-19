import React from 'react';
// import PropTypes from 'prop-types';
import { Field, FormSpy } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Checkbox, TextField } from 'components/ReduxFormFields';
import { composeValidators, required } from 'util/forms';

const DCOSEESection = () => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <React.Fragment>
        <Row gutter={5}>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.appGroupPrefix"
              label="App Group Prefix"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.dcos_cluster_name"
              label="DCOS Cluster Name"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.haproxyGroup"
              label="HAProxy Group"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.marathon_framework_name"
              label="Marathon Framework Name"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={3} xs={12}>
            <Field
              id="accept_any_cert"
              component={Checkbox}
              name="properties.config.accept_any_cert"
              label="Accept Any Certificate"
              checked={values.properties.config.accept_any_cert}
              style={{ minWidth: '10em' }}
            />
          </Col>
        </Row>
        <Row gutter={5}>
          <Col flex={2} xs={12} sm={12} md={4}>
            <Field
              id="secret_support"
              component={Checkbox}
              name="properties.config.secret_support"
              label="Secret Support"
              checked={values.properties.config.secret_support}
              style={{ minWidth: '10em' }}
            />
          </Col>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.secret_store"
              label="Secret Store"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={4} md={4}>
            <Field
              component={TextField}
              name="properties.config.secret_url"
              label="Secret URL"
            />
          </Col>
        </Row>
      </React.Fragment>
    )}
  </FormSpy>
);

DCOSEESection.propTypes = {};

export default DCOSEESection;
