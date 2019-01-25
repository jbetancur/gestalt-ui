import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'jest-styled-components';
import theme from '../src/themes/light';

export const renderWithTheme = (tree, ...args) =>
  render(
    <ThemeProvider theme={theme}>
      <Router>
        <Route>
          {tree}
        </Route>
      </Router>
    </ThemeProvider>,
    ...args);
