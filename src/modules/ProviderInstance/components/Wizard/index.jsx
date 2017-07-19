import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'components/Stepper';
import { ConfigureProvider, ConfigureActions } from 'modules/ProviderInstance';

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
      <div className="flex-row">
        <Stepper className="flex-12" steps={steps} onFinish={() => this.props.hideProviderInstanceModal()} />
      </div>
    );
  }
}
