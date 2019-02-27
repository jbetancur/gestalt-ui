import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, FormSpy } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Slider, FontIcon } from 'react-md';
import { composeValidators, fixInputNumber, fixInputDecimal, min, max, mod, required } from 'util/forms';

const SliderStyled = styled(Slider)`
  .md-slider-thumb {
    z-index: 2;
  }

  .md-slider-discrete-tick {
    z-index: 1;
  }
`;

class ComputeForm extends Component {
  static propTypes = {
    cpuName: PropTypes.string,
    memName: PropTypes.string,
    cpuMin: PropTypes.number,
    cpuMax: PropTypes.number,
    cpuStep: PropTypes.number,
    cpuStepSlider: PropTypes.number,
    memMin: PropTypes.number,
    memMax: PropTypes.number,
    memStep: PropTypes.number,
    memStepSlider: PropTypes.number,
    cpuDiscrete: PropTypes.bool,
    memDiscrete: PropTypes.bool,
  };

  static defaultProps = {
    cpuName: 'properties.cpus',
    memName: 'properties.memory',
    cpuMin: 0.1,
    cpuMax: 4.0,
    cpuStep: 0.1,
    cpuStepSlider: 0.1,
    memMin: 128,
    memMax: 2048,
    memStep: 1,
    memStepSlider: 32,
    cpuDiscrete: true,
    memDiscrete: true,
  };

  handleFocus = (event) => {
    const { target } = event;

    setTimeout(() => target.select());
  }

  onChangeCPU = form => (value) => {
    const { cpuName, cpuMin } = this.props;
    const formattedValue = value || value >= 0
      ? fixInputDecimal(value)
      : cpuMin;

    if (typeof formattedValue === 'number') {
      form.change(cpuName, formattedValue);
    }
  }

  onChangeMemory = form => (value) => {
    const { memName, memMin } = this.props;
    const formattedValue = value || value >= 0
      ? fixInputNumber(value)
      : memMin;

    if (typeof formattedValue === 'number') {
      form.change(memName, formattedValue);
    }
  }

  render() {
    const {
      cpuName,
      memName,
      cpuMin,
      cpuMax,
      cpuStep,
      cpuStepSlider,
      memMin,
      memMax,
      memStep,
      memStepSlider,
      cpuDiscrete,
      memDiscrete,
    } = this.props;

    return (
      <FormSpy subscription={{ values: true }}>
        {({ form, values }) => (
          <Row gutter={5}>
            <Col flex={10} xs={8}>
              <SliderStyled
                id={`${cpuName}--cpu`}
                label="CPU"
                min={cpuMin}
                max={cpuMax}
                step={cpuStepSlider}
                leftIcon={<FontIcon>memory</FontIcon>}
                value={values.properties.cpus}
                onChange={this.onChangeCPU(form)}
                discrete={cpuDiscrete}
                valuePrecision={1}
              />
            </Col>
            <Col flex={2} xs={4} alignSelf="center">
              <Field
                component={TextField}
                name={cpuName}
                step={cpuStep}
                placeholder="CPU"
                type="number"
                required
                onChange={this.onChangeCPU(form)}
                onFocus={this.handleFocus}
                parse={fixInputDecimal}
                format={fixInputDecimal}
                validate={composeValidators(
                  min(cpuMin),
                  max(cpuMax),
                  required('cpu is required'))
                }
              />
            </Col>
            <Col flex={10} xs={8}>
              <SliderStyled
                id={`${memName}--memory`}
                label="Memory (MB)"
                min={memMin}
                max={memMax}
                step={memStepSlider}
                leftIcon={<FontIcon>sd_card</FontIcon>}
                value={values.properties.memory}
                onChange={this.onChangeMemory(form)}
                discrete={memDiscrete}
                discreteTicks={memMin}
                tickWidth={6}
              />
            </Col>
            <Col flex={2} xs={4} alignSelf="center">
              <Field
                component={TextField}
                name={memName}
                step={memStep}
                placeholder="Memory"
                type="number"
                required
                onChange={this.onChangeMemory(form)}
                onFocus={this.handleFocus}
                parse={fixInputNumber}
                format={fixInputNumber}
                validate={composeValidators(
                  min(memMin),
                  max(memMax),
                  mod(memStep),
                  required('memory is required'))
                }
              />
            </Col>
          </Row>
        )}
      </FormSpy>
    );
  }
}

export default ComputeForm;
