import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import TextField from 'components/TextField';

const URLConfigSection = () => (
  <Row gutter={5}>
    <Col flex={6} xs={12} sm={12}>
      <Field
        component={TextField}
        name="properties.config.url"
        label="Provider URL/Host:Port"
        type="text"
        required
      />
    </Col>
  </Row>
);

export default URLConfigSection;
