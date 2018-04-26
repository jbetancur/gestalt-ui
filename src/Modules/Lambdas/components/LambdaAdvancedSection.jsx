import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Checkbox, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const LambdaAdvancedSection = ({ formValues }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="Advanced">
        <Row gutter={5}>
          <Col flex={3} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.cpus"
              min={0.1}
              max={4.0}
              step={0.1}
              label="CPU"
              type="number"
              required
              parse={value => parseFloat(value)} // redux form formats everything as string, so force number
            />
          </Col>
          <Col flex={3} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.memory"
              min={256}
              max={2048}
              step={256}
              label="Memory"
              type="number"
              required
              parse={value => Number(value)} // redux form formats everything as string, so force number
            />
          </Col>
          <Col flex={3} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.timeout"
              min={1}
              step={1}
              label="Timeout"
              type="number"
              required
              parse={value => Number(value)} // redux form formats everything as string, so force number
            />
          </Col>
          <Col flex={3} xs={6} sm={6}>
            <Field
              id="public"
              component={Checkbox}
              name="properties.public"
              // TODO: Find out why redux-form state for bool doesn't apply
              checked={formValues.properties.public}
              label="Public"
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

LambdaAdvancedSection.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default LambdaAdvancedSection;
