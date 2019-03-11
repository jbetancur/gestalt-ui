import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StepperContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Indicators = styled.ol`
  list-style: none;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 64px;
  padding-right: 64px;
`;

const Indicator = styled.li`
  width: 15em;
  text-align: center;
`;

const IndicatorNumber = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 28px;
  margin-left: 1px;
  border-radius: 50%;
  position: relative;
  text-align: center;
  z-index: 1;
  border: 2px solid ${props => props.theme.colors.grey[500]};
  color: ${props => props.theme.colors.grey[500]};
  background-color: ${props => props.theme.colors.common.white};

  &.active {
    border: 2px solid ${props => props.theme.colors.secondary[500]};
    color: ${props => props.theme.colors.common.white};
    background-color: ${props => props.theme.colors.secondary[500]};
  }
`;

const IndicatorLabel = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  height: 24px;
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  width: 100%;
`;

const Steps = styled.div`
  min-height: 14em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export default class Stepper extends Component {
  static propTypes = {
    steps: PropTypes.array,
    className: PropTypes.string,
    activeStep: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    steps: [{ title: '', component: <div /> }],
    activeStep: 0,
  };

  handleStepChange(activeStep) {
    this.setState({ activeStep });
  }

  render() {
    const { className, steps, activeStep } = this.props;
    const stepIndicators = steps.map((step, i) => (
      <Indicator key={`wizard-step--${step.title}--${i}`}>
        <IndicatorNumber className={`${activeStep === i && 'active'}`}>
          <span>{i + 1}</span>
        </IndicatorNumber>

        <IndicatorLabel>{step.label}</IndicatorLabel>
      </Indicator>
    ));

    return (
      <StepperContainer className={className}>
        <Indicators>
          {stepIndicators}
        </Indicators>
        <Steps>
          {steps[activeStep].component}
        </Steps>
      </StepperContainer>
    );
  }
}
