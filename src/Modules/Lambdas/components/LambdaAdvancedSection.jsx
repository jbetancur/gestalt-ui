import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Compute } from 'components/Form';
import { fixInputNumber } from 'util/forms';
import responseHeaders from '../lists/responseHeaders';
import withLambdaState from '../hocs/withLambdaState';

const LambdaAdvancedSection = ({ formValues, form, selectedRuntime }) => (
  <Panel title="Function Options" fill expandable={false}>
    <Row gutter={5}>
      <Compute formValues={formValues} form={form} />
      <Col flex={2} xs={6} sm={6}>
        <Field
          component={TextField}
          name="properties.pre_warm"
          min={0}
          step={1}
          label="Pre Warm"
          type="number"
          required
          helpText="executors"
          format={fixInputNumber}
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
          helpText="in seconds"
          format={fixInputNumber}
        />
      </Col>
      <Col flex={8} xs={12} sm={12}>
        <Field
          id="select-return-type"
          component={SelectField}
          name="properties.headers.Content-Type"
          menuItems={responseHeaders}
          itemLabel="displayName"
          itemValue="value"
          required
          label="Content Type"
        />
      </Col>
      <Col flex={3} xs={12} sm={12}>
        <Field
          id="lambda--public"
          component={Checkbox}
          name="properties.public"
          checked={formValues.properties.public}
          label="Make Public"
        />
      </Col>
      {selectedRuntime.options && selectedRuntime.options.isolate &&
        <Col flex={6} xs={12} sm={12}>
          <Field
            id="lambda--isolate"
            component={Checkbox}
            name="properties.isolate"
            checked={formValues.properties.isolate}
            label="Run in an isolated class loader"
          />
        </Col>}
    </Row>
  </Panel>
);

LambdaAdvancedSection.propTypes = {
  formValues: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectedRuntime: PropTypes.object.isRequired,
};

export default withLambdaState(LambdaAdvancedSection);
