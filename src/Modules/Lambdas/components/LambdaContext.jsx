
import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { providerModel } from 'Modules/Providers';
import runTimes from '../lists/runTimes';

export const defaultState = {
  theme: 'chrome',
  selectedProvider: providerModel.get(),
  selectedRuntime: {
    value: null,
    defaultMem: 128,
    format: null,
    codeFormat: null,
    starterCode: null,
    options: {},
    codeOptions: [{ displayName: 'Package', value: 'package' }],
  },
};

const LambdaContext = createContext(defaultState);

export class LambdaProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  handleProviderChange = (selectedProvider, providers) => {
    console.log(selectedProvider);
    this.setState({ selectedProvider });
  }

  handleExecutorChange = (id, executors) => {
    const selectedExecutor = executors.find(e => e.id === id);

    this.setState({
      codeOptions: [{ displayName: 'Package', value: 'package' }],
      ...runTimes.find(runtime => runtime.value === get(selectedExecutor, 'properties.config.env.public.RUNTIME')),
    });
  }

  render() {
    const { children } = this.props;
    const state = {
      ...this.state,
      onProviderChange: this.handleProviderChange,
      onExecutorChange: this.handleExecutorChange,
    };

    return (
      <LambdaContext.Provider value={state}>
        {children}
      </LambdaContext.Provider>
    );
  }
}

export const LambdaConsumer = LambdaContext.Consumer;
