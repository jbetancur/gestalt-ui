import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Stepper } from 'components/Stepper';
import { Col, Row } from 'react-flexybox';
import { FullPage } from 'components/FullPage';
import ProviderTypePage from './ProviderTypePage';
import ResourceTypePage from './ResourceTypePage';
import ActionsPage from './ActionsPage';

class ServiceWizardForm extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resourcetypesData: PropTypes.array,
    lambdasData: PropTypes.array,
  };

  static defaultProps = {
    resourcetypesData: [],
    lambdasData: [],
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
    const { onSubmit, resourcetypesData } = this.props;
    const providerFilteredTypes = resourcetypesData;
    const resourceFilteredTypes = resourcetypesData;

    const steps = [
      {
        label: 'Service Definition',
        component: <ProviderTypePage
          onSubmit={this.nextPage}
          providerTypes={providerFilteredTypes}
          resourcetypesData={resourceFilteredTypes}
        />,
      },
      {
        label: 'Resource Definitions',
        component: <ResourceTypePage
          addStep={this.addStep}
          removeStep={this.removeStep}
          previousPage={this.previousPage}
          onSubmit={this.nextPage}
          resourcetypesData={resourceFilteredTypes}
        />
      },
      {
        label: 'Action Mappings',
        component: <ActionsPage
          previousPage={this.previousPage}
          onSubmit={this.props.onSubmit}
          lambdas={this.props.lambdasData}
        />
      }
    ];

    return (
      <FullPage title="Create a Service Specification" backURL={`/${this.props.match.params.fqon}/servicespecs`}>
        <Row justifyContent="center">
          <Col flex={8}>
            <Stepper
              steps={steps}
              onSubmit={onSubmit}
              activeStep={this.state.step}
            />
          </Col>
        </Row>
      </FullPage>
    );
  }
}

export default withRouter(ServiceWizardForm);
