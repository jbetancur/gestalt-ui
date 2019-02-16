import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-final-form';
import { Button } from 'components/Buttons';
import FormTag from '../Form';

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
  margin: 0;
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
  border: 2px solid ${props => props.theme.colors['$md-grey-500']};
  color: ${props => props.theme.colors['$md-grey-500']};
  background-color: ${props => props.theme.colors['$md-white']};

  &.active {
    border: 2px solid ${props => props.theme.colors['$md-blue-500']};
    color: ${props => props.theme.colors['$md-white']};
    background-color: ${props => props.theme.colors['$md-blue-500']};
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
  ${props => props.position && `position: ${props.position}`};
  ${props => props.disabled && 'pointer-events: none'};
  min-height: 14em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StepActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 8px;

  button,
  a {
    margin: 5px;
  }
`;

export default class Stepper extends Component {
  static Page = ({ children }) => children;

  static propTypes = {
    onFinish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    className: PropTypes.string,
    page: PropTypes.number,
    formProps: PropTypes.object,
    initialValues: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    debug: PropTypes.bool,
    pending: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    page: 0,
    formProps: {},
    initialValues: {},
    debug: false,
    pending: false,
  };

  state = {
    page: this.props.page,
    values: this.props.initialValues,
  };

  next = (values) => {
    this.setState(state => ({
      page: Math.min(state.page + 1, this.props.children.length - 1),
      values,
    }));
  }

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0)
    }));

  validate = (values) => {
    const activePage = React.Children.toArray(this.props.children)[this.state.page];

    return activePage.props.validate ? activePage.props.validate(values) : {};
  }

  handleSubmit = (values) => {
    const { children, onFinish } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;

    if (isLastPage) {
      onFinish(values);
    } else {
      this.next(values);
    }
  }

  generateIndicators() {
    const { children } = this.props;
    const { page } = this.state;

    return React.Children.map(children, ({ props }, i) => (
      <Indicator key={`stepper-page--${props.title}--${i}`}>
        <IndicatorNumber className={`${page === i && 'active'}`}>
          <span>{i + 1}</span>
        </IndicatorNumber>

        <IndicatorLabel>{props.title}</IndicatorLabel>
      </Indicator>
    ));
  }

  render() {
    const { debug, children, onCancel, pending, formProps, ...rest } = this.props;
    const activePage = React.Children.toArray(children)[this.state.page];
    const isLastPage = this.state.page === React.Children.count(children) - 1;

    return (
      <StepperContainer {...rest}>
        <Indicators>
          {this.generateIndicators()}
        </Indicators>
        <Steps>
          <Form
            initialValues={this.state.values}
            validate={this.validate}
            onSubmit={this.handleSubmit}
            {...formProps}
          >
            {({ handleSubmit, submitting, invalid, values }) => (
              <FormTag onSubmit={handleSubmit} disabled={pending} disableFooter>
                {activePage}
                <StepActions>
                  <Button flat onClick={onCancel}>Cancel</Button>
                  {this.state.page > 0 && (
                    <Button flat onClick={this.previous}>
                      Previous
                    </Button>
                  )}
                  {!isLastPage && (
                    <Button raised primary type="submit" disabled={invalid}>Next</Button>
                  )}
                  {isLastPage && (
                    <Button raised primary type="submit" disabled={submitting || invalid}>
                      Finish
                    </Button>
                  )}
                </StepActions>

                {debug && <pre>{JSON.stringify(values, 0, 2)}</pre>}
              </FormTag>
            )}
          </Form>
        </Steps>
      </StepperContainer>
    );
  }
}
