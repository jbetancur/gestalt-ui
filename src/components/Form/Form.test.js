import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { renderWithTheme } from '../../../test/helpers';
import Form from './Form';

describe('Components::Form::Form', () => {
  it('mounts with default props', () => {
    const { container } = renderWithTheme(
      <Router>
        <Route>
          <Form>
            <div>ho</div>
          </Form>
        </Route>
      </Router>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const { container } = renderWithTheme(
      <Router>
        <Route>
          <Form disabled>
            <div>ho</div>
          </Form>
        </Route>
      </Router>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
