import React from 'react';
// import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Field } from 'react-final-form';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { composeValidators, required } from 'util/forms';

const PolicyForm = () => (
  <Row gutter={5}>
    <Col flex={7} xs={12} sm={12}>
      <Panel title="General" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Policy Name"
              validate={composeValidators(required('policy name is required'))}
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={5} xs={12} sm={12}>
      <Panel title="Description" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              placeholder="Description"
              rows={1}
              maxRows={6}
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
