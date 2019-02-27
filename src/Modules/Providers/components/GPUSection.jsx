import React, { Fragment, memo } from 'react';
// import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field, FormSpy } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Conditional } from 'components/Form';
import { Chips } from 'components/Lists';
import { SelectField, Checkbox } from 'components/ReduxFormFields';

const GPUSection = memo(() => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <Fragment>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="gpu-enabled"
              component={Checkbox}
              name="properties.config.gpu_support.enabled"
              defaultChecked={get(values, 'properties.config.gpu_support.enabled')}
              label="Enable GPU Support"
            />
          </Col>
        </Row>

        <Conditional when="properties.config.gpu_support.enabled" is={true}>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="gpu-types"
                label="Add Accelerator Type"
                addLabel="Add Accelerator Type"
                component={Chips}
                name="properties.config.gpu_support.types"
                ignorePrefixValidation
              />
            </Col>

            {get(values, 'properties.config.gpu_support.types.length') > 0 && (
              <Col flex={6} xs={12} sm={12}>
                <Field
                  id="gpu-default-type"
                  name="properties.config.gpu_support.default_type"
                  label="Default Accelerator"
                  component={SelectField}
                  menuItems={['', ...get(values, 'properties.config.gpu_support.types') || []]}
                  helpText="Sets the default GPU accelerator to display in the GPU section when creating Lambdas or Containers. More Info: https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/"
                />
              </Col>
            )}
          </Row>
        </Conditional>
      </Fragment>
    )}
  </FormSpy>
));

GPUSection.propTypes = {};

export default GPUSection;
