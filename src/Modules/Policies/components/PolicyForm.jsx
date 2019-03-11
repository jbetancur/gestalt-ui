import React from 'react';
// import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Field } from 'react-final-form';
import { TextField } from 'components/Form';
import { Panel } from 'components/Panels';
import { composeValidators, required } from 'util/forms';

const PolicyForm = () => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel expandable={false} fill>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Policy Name"
              validate={composeValidators(required('policy name is required'))}
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
        </Row>
      </Panel>
    </Col>
  </Row>
);

PolicyForm.propTypes = {};

PolicyForm.defaultProps = {};

export default PolicyForm;
