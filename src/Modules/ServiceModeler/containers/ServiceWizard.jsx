import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stepper } from 'components/Stepper';
import { Col, Row } from 'react-flexybox';
import { Card, CardContent } from 'components/Cards';
import ProviderTypePage from './ProviderTypePage';
import ResourceTypePage from './ResourceTypePage';
import ActionsPage from './ActionsPage';

class ServiceWizardForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    resourceTypesDropDown: PropTypes.array,
    lambdasDropDown: PropTypes.array,
  };

  static defaultProps = {
    resourceTypesDropDown: [],
    lambdasDropDown: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  nextPage = () => {
    this.setState({ step: this.state.step + 1 });
  }

  previousPage = () => {
    if (this.state.step > 0) {
      this.setState({ step: this.state.step - 1 });
    }
  }

  render() {
    const { onSubmit, resourceTypesDropDown } = this.props;
    const providerFilteredTypes = resourceTypesDropDown;
    const resourceFilteredTypes = resourceTypesDropDown;

    const steps = [
      {
        label: 'Service Definition',
        component: <ProviderTypePage
          onSubmit={this.nextPage}
          providerTypes={providerFilteredTypes}
          resourceTypesDropDown={resourceFilteredTypes}
        />,
      },
      {
        label: 'Resource Definitions',
        component: <ResourceTypePage
          addStep={this.addStep}
          removeStep={this.removeStep}
          previousPage={this.previousPage}
          onSubmit={this.nextPage}
          resourceTypesDropDown={resourceFilteredTypes}
        />
      },
      {
        label: 'Action Mappings',
        component: <ActionsPage
          previousPage={this.previousPage}
          onSubmit={this.props.onSubmit}
          lambdas={this.props.lambdasDropDown}
        />
      }
    ];

    return (
      <Row center gutter={5}>
        <Col flex={10}>
          <Card>
            <CardContent>
              <Stepper
                steps={steps}
                onSubmit={onSubmit}
                activeStep={this.state.step}
              />
            </CardContent>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ServiceWizardForm;
