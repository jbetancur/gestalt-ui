import React from 'react';
import H3 from './H3';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) H3', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<H3>this is a test</H3>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
