import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, FormSpy } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/Form';
import Slider from '@material-ui/lab/Slider';
import MemoryIcon from '@material-ui/icons/SdCard';
import CPUIcon from '@material-ui/icons/Memory';
import { composeValidators, fixInputNumber, fixInputDecimal, min, max, mod, required } from 'util/forms';

const SliderStyled = styled(Slider)`
  padding: 24px 8px 0 8px;
`;

const Label = styled.span`
  padding-left: 8px;
`;

class ComputeForm extends Component {
  static propTypes = {
    cpuName: PropTypes.string,
    memName: PropTypes.string,
    cpuMin: PropTypes.number,
    cpuMax: PropTypes.number,
    cpuStep: PropTypes.number,
    memMin: PropTypes.number,
    memMax: PropTypes.number,
    memStep: PropTypes.number,
  };

  static defaultProps = {
    cpuName: 'properties.cpus',
    memName: 'properties.memory',
    cpuMin: 0.1,
    cpuMax: 4.0,
    cpuStep: 0.1,
    memMin: 128,
    memMax: 2048,
    memStep: 1,
  };

  onChangeCPUSlider = form => (event, value) => {
    const { cpuName, cpuMin } = this.props;
    const formattedValue = value || value >= 0
      ? fixInputDecimal(value)
      : cpuMin;

    if (typeof formattedValue === 'number') {
      form.change(cpuName, formattedValue);
    }
  }

  onChangeMemorySlider = form => (event, value) => {
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
      memMin,
      memMax,
      memStep,
    } = this.props;

    return (
      <FormSpy subscription={{ values: true }}>
        {({ form, values }) => (
          <Row gutter={5} center>
            <Col flex={10} xs={8}>
              <CPUIcon fontSize="small" color="action" />
              <Label>CPU</Label>
              <SliderStyled
                value={values.properties.cpus}
                aria-labelledby="label"
                onChange={this.onChangeCPUSlider(form)}
                min={cpuMin}
                max={cpuMax}
                step={cpuStep}
              />
            </Col>
            <Col flex={2} xs={4} alignSelf="center">
              <Field
                component={TextField}
                name={cpuName}
                inputProps={{
                  min: cpuMin,
                  max: cpuMax,
                  step: cpuStep,
                }}
                label="CPU"
                type="number"
                required
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
              <MemoryIcon fontSize="small" color="action" />
              <Label>Memory (MB)</Label>
              <SliderStyled
                value={values.properties.memory}
                aria-labelledby="label"
                onChange={this.onChangeMemorySlider(form)}
                min={memMin}
                max={memMax}
                step={memStep}
              />
            </Col>
            <Col flex={2} xs={4} alignSelf="center">
              <Field
                component={TextField}
                name={memName}
                inputProps={{
                  min: memMin,
                  max: memMax,
                  step: memStep,
                }}
                label="Memory"
                type="number"
                required
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
