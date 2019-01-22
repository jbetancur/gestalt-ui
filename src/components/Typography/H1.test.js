import React from 'react';
import H1 from './H1';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) H1', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<H1>this is a test</H1>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
