import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Fieldset from 'components/Fieldset';
import Checkbox from 'components/Checkbox';
import TextField from 'components/TextField';

const DCOSEESection = props => (
  <Fieldset legend="Enterprise Edition">
    <Row gutter={5}>
      <Col key="config-auth--appGroupPrefix" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.appGroupPrefix"
          label="App Group Prefix"
          required
        />
      </Col>
      <Col key="config-auth--dcos_cluster_name" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.dcos_cluster_name"
          label="DCOS Cluster Name"
          required
        />
      </Col>
      <Col key="config--haproxyGroup" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.haproxyGroup"
          label="HAProxy Group"
          required
        />
      </Col>
      <Col key="config--marathon_framework_name" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.marathon_framework_name"
          label="Marathon Framework Name"
          required
        />
      </Col>
      <Col key="config--accept_any_cert" flex={3} xs={12}>
        <Field
          id="accept_any_cert"
          component={Checkbox}
          name="properties.config.accept_any_cert"
          label="Accept Any Certificate"
          checked={props.values.properties.config.accept_any_cert}
          style={{ minWidth: '10em' }}
        />
      </Col>
    </Row>
    <Row gutter={5}>
      <Col key="config--secret_support" flex={2} xs={12} sm={12} md={4}>
        <Field
          id="secret_support"
          component={Checkbox}
          name="properties.config.secret_support"
          label="Secret Support"
          checked={props.values.properties.config.secret_support}
          style={{ minWidth: '10em' }}
        />
      </Col>
      <Col key="config--secret_store" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.secret_store"
          label="Secret Store"
          required
        />
      </Col>
      <Col key="config--secret_url" flex={2} xs={12} sm={4} md={4}>
        <Field
          component={TextField}
          name="properties.config.secret_url"
          label="Secret URL"
        />
      </Col>
    </Row>
  </Fieldset>
);

DCOSEESection.propTypes = {
  values: PropTypes.object.isRequired,
};

export default DCOSEESection;
