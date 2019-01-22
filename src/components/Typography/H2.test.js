import React from 'react';
import H2 from './H2';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) H2', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<H2>this is a test</H2>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
