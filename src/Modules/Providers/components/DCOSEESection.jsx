import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Checkbox, TextField } from 'components/Form';
import { composeValidators, required } from 'util/forms';

const DCOSEESection = () => (
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
          type="checkbox"
          name="properties.config.accept_any_cert"
          label="Accept Any Certificate"
          style={{ minWidth: '10em' }}
        />
      </Col>
    </Row>
    <Row gutter={5}>
      <Col flex={2} xs={12} sm={12} md={4}>
        <Field
          id="secret_support"
          component={Checkbox}
          type="checkbox"
          name="properties.config.secret_support"
          label="Secret Support"
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
);

DCOSEESection.propTypes = {};

export default DCOSEESection;
