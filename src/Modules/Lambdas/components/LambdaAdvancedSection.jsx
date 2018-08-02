import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { fixInputNumber } from 'util/forms';

const LambdaAdvancedSection = () => (
  <Panel title="Compute" fill>
    <Row gutter={5}>
      <Col flex={2} xs={6} sm={6}>
        <Field
          component={TextField}
          name="properties.cpus"
          min={0.1}
          max={4.0}
          step={0.1}
          label="CPU"
          type="number"
          required
          normalize={fixInputNumber}
        />
      </Col>
      <Col flex={2} xs={6} sm={6}>
        <Field
          component={TextField}
          name="properties.memory"
          min={256}
          max={2048}
          step={256}
          label="Memory"
          type="number"
          required
          normalize={fixInputNumber}
        />
      </Col>
      <Col flex={2} xs={6} sm={6}>
        <Field
          component={TextField}
          name="properties.timeout"
          min={1}
          step={1}
          label="Timeout"
          type="number"
          required
          normalize={fixInputNumber}
        />
      </Col>
      <Col flex={2} xs={6} sm={6}>
        <Field
          component={TextField}
          name="properties.pre_warm"
          min={0}
          step={1}
          label="Pre Warm Executors"
          type="number"
          required
          normalize={fixInputNumber}
        />
      </Col>
    </Row>
  </Panel>
);

// LambdaAdvancedSection.propTypes = {
//   formValues: PropTypes.object.isRequired,
// };

export default LambdaAdvancedSection;
