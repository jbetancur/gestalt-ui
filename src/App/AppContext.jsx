
import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';

export const defaultState = {
  favoritesOpen: false,
  onToggleFavorites: null,
};

const AppContext = createContext(defaultState);

export class AppProvider extends PureComponent {
  static propTypes = {
    initialState: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  render() {
    const { children, initialState } = this.props;

    return (
      <AppContext.Provider value={initialState}>
        {children}
      </AppContext.Provider>
    );
  }
}

export const AppConsumer = AppContext.Consumer;
