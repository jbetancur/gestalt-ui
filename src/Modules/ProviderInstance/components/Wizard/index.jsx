import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-flexybox';
import Stepper from 'components/Stepper';
import ConfigureProvider from '../../components/ConfigureProvider';
import ConfigureActions from '../../components/ConfigureActions';

const steps = [
  {
    label: 'Create a Provider Instance',
    component: <ConfigureProvider {...this.props} />,
  },
  {
    label: 'Configure Provider Actions',
    component: <ConfigureActions {...this.props} />,
  },
];

export default class ProviderInstanceWizard extends PureComponent {
  static propTypes = {
    hideProviderInstanceModal: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Row gutter={5}>
        <Stepper className="flex-12" steps={steps} onFinish={() => this.props.hideProviderInstanceModal()} />
      </Row>
    );
  }
}
