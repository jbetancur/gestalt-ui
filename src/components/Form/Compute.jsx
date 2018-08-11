import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Slider, FontIcon } from 'react-md';
import { fixInputNumber, fixInputDecimal } from 'util/forms';

class ComputeForm extends Component {
  static propTypes = {
    formValues: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    cpuName: PropTypes.string,
    memoryName: PropTypes.string,
  };

  static defaultProps = {
    cpuName: 'properties.cpus',
    memoryName: 'properties.memory',
  };

  onChangeCPU = (value) => {
    const { form, cpuName } = this.props;

    form.change(cpuName, parseFloat(value.toFixed(1)));
  }

  onChangeMemory = (value) => {
    const { form, memoryName } = this.props;

    form.change(memoryName, value);
  }

  render() {
    const { formValues, cpuName, memoryName } = this.props;

    return (
      <Row gutter={10}>
        <Col flex={10} xs={8}>
          <Slider
            id={cpuName}
            label="CPU"
            min={0.1}
            max={4.0}
            step={0.1}
            leftIcon={<FontIcon>memory</FontIcon>}
            value={formValues.properties.cpus}
            onChange={this.onChangeCPU}
            discrete
            valuePrecision={1}
          />
        </Col>
        <Col flex={2} xs={4} alignSelf="center">
          <Field
            component={TextField}
            name={cpuName}
            min={0.1}
            max={4.0}
            step={0.1}
            placeholder="CPU"
            type="number"
            required
            fullWidth={false}
            format={fixInputDecimal}
          />
        </Col>
        <Col flex={10} xs={8}>
          <Slider
            id={memoryName}
            label="Memory (MB)"
            min={128}
            max={2048}
            step={64}
            leftIcon={<FontIcon>sd_card</FontIcon>}
            value={formValues.properties.memory}
            onChange={this.onChangeMemory}
            discrete
          />
        </Col>
        <Col flex={2} xs={4} alignSelf="center">
          <Field
            component={TextField}
            name={memoryName}
            min={128}
            max={2048}
            step={64}
            placeholder="Memory"
            type="number"
            required
            fullWidth={false}
            format={fixInputNumber}
          />
        </Col>
      </Row>
    );
  }
}

export default ComputeForm;
