import React from 'react';
import Title from './Title';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) Title', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<Title>this is a test</Title>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it render with small prop', () => {
    const { container } = renderWithTheme(<Title small>this is a test</Title>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('it render with large prop', () => {
    const { container } = renderWithTheme(<Title large>this is a test</Title>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
