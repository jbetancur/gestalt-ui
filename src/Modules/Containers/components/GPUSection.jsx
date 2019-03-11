import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Conditional, TextField, SelectField, Checkbox } from 'components/Form';
import { composeValidators, fixInputNumber, min, max, required } from 'util/forms';

const GPUSection = memo(({ selectedProvider }) => (
  <Fragment>
    <Row gutter={5}>
      <Col flex={12}>
        <Field
          id="gpu-enabled"
          component={Checkbox}
          type="checkbox"
          name="properties.gpu_support.enabled"
          label="Enable GPU Support"
        />
      </Col>
    </Row>

    <Conditional when="properties.gpu_support.enabled" is={true}>
      <Row gutter={5}>
        <Col flex={3}>
          <Field
            component={TextField}
            name="properties.gpu_support.count"
            inputProps={{
              min: 1,
              max: 64,
              step: 1,
            }}
            label="GPU Count"
            type="number"
            required
            toolTip="gpu count"
            format={fixInputNumber}
            parse={fixInputNumber}
            validate={composeValidators(
              min(1),
              max(64),
              required('gpu is required'))
            }
          />
        </Col>

        <Col flex={9} xs={12} sm={12}>
          <Field
            id="gpu-default-type"
            name="properties.gpu_support.type"
            label="Accelerator Type"
            component={SelectField}
            menuItems={get(selectedProvider, 'properties.config.gpu_support.types') || []}
            required
            validate={composeValidators(
              required('gpu type is required'))
            }
          />
        </Col>
      </Row>
    </Conditional>
  </Fragment>
));

GPUSection.propTypes = {
  selectedProvider: PropTypes.object.isRequired,
};

export default GPUSection;
