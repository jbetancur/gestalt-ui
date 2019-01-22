import React from 'react';
import Header from './Header';
import { renderWithTheme } from '../../../../test/helpers';

describe('(Panels) Header', () => {
  it('renders without exploding', () => {
    const { container } = renderWithTheme(
      <Header title="gazobazorb" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a title', () => {
    const { container } = renderWithTheme(
      <Header title="gazobazorb" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
