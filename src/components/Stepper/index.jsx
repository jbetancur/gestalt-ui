import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'components/Buttons';

const StepperContainer = styled.div`
  height: 100vh;
`;

const Indicators = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  // border-bottom: 3px solid blue;
`;

const Indicator = styled.div`
  width: 15em;
  text-align: center;
  cursor: pointer;
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
  border: 2px solid ${props => props.theme.colors['$md-grey-500']};
  color: ${props => props.theme.colors['$md-grey-500']};
  background-color: ${props => props.theme.colors['$md-white']};

  &.active {
    border: 2px solid ${props => props.theme.colors['$md-blue-500']};
    color: ${props => props.theme.colors['$md-white']};
    background-color: ${props => props.theme.colors['$md-blue-500']};
  }

  // span:after {
  //   width: 100em;
  //   height: 1px;
  //   position: absolute;
  //   top: 50%;
  //   left: 40px;
  //   background-color: ${props => props.theme.colors['$md-grey-200']};
  //   content: " ";
  // }

  // span:first-child {
  //   &:after {
  //     left: 50%;
  //   }
  // }

  // span:last-child {
  //   &:after {
  //     right: 50%;
  //     left: auto;
  //   }
  // }
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
  min-height: 25em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2em;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

export default class Stepper extends Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    onFinish: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    onFinish: () => { },
    className: '',
  };

  constructor() {
    super();

    this.state = { activeStep: 0 };
  }

  handleStepChange(activeStep) {
    this.setState({ activeStep });
  }

  nextStep() {
    const { steps } = this.props;

    if (this.state.activeStep < steps.length - 1) {
      this.setState({ activeStep: this.state.activeStep + 1 });
    }
  }

  previousStep() {
    if (this.state.activeStep > 0) {
      this.setState({ activeStep: this.state.activeStep - 1 });
    }
  }

  render() {
    const { className, steps, onFinish } = this.props;
    const { activeStep } = this.state;
    const stepIndicators = steps.map((step, i) => (
      <Indicator onClick={() => this.handleStepChange(i)}>
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
        <Actions>
          {activeStep > 0 && <Button flat label="Previous" onClick={() => this.previousStep()} />}
          {activeStep === steps.length - 1 ?
            <Button label="Finish" primary raised disabled={!!steps[activeStep].exitValidation} onClick={onFinish} /> :
            <Button label="Next" primary raised disabled={!!steps[activeStep].exitValidation} onClick={() => this.nextStep()} />}
        </Actions>
      </StepperContainer>
    );
  }
}
