import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field, FormSpy } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/Form';
import Alert from 'components/Alert';
import { fixInputNumber } from 'util/forms';
import ComputeSection from './ComputeSection';
import GPUSection from './GPUSection';
import responseHeaders from '../lists/responseHeaders';
import withLambdaState from '../hocs/withLambdaState';

const LambdaAdvancedSection = ({ selectedProvider, selectedRuntime }) => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <Fragment>
        <Row gutter={5}>
          <ComputeSection />
          <Col flex={3} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.pre_warm"
              min={0}
              step={1}
              label="Pre Warm"
              type="number"
              required
              toolTip="pre-warm lamdas will execute in your local environment"
              format={fixInputNumber}
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
              toolTip="the number of seconds before this lambda times out"
              format={fixInputNumber}
            />
          </Col>
          <Col flex={6} xs={12} sm={12}>
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
          {/* <Col flex={3} xs={12} sm={12}>
            <Field
              id="lambda--public"
              component={Checkbox}
              type="checkbox"
              name="properties.public"
              label="Make Public"
            />
          </Col> */}
          {get(selectedRuntime, 'options.isolate') &&
            <Col flex={6} xs={12} sm={12}>
              <Field
                id="lambda--isolate"
                type="checkbox"
                component={Checkbox}
                name="properties.isolate"
                label="Run in an isolated class loader"
              />
            </Col>}
        </Row>

        {get(values, 'properties.pre_warm') && values.properties.pre_warm > 0
          ? (
            <Row>
              <Col flex>
                <Alert width="auto" message={{ message: 'Pre-warm lamdas will execute and deploy containers in this Environment', icon: true, status: 'warning' }} />
              </Col>
            </Row>
          ) : null}

        {get(selectedProvider, 'properties.config.gpu_support.enabled') && (
          <GPUSection selectedProvider={selectedProvider} />
        )}
      </Fragment>
    )}
  </FormSpy>
);

LambdaAdvancedSection.propTypes = {
  selectedProvider: PropTypes.object.isRequired,
  selectedRuntime: PropTypes.object.isRequired,
};

export default withLambdaState(LambdaAdvancedSection);
