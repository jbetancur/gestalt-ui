import React from 'react';
import H5 from './H5';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) H5', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<H5>this is a test</H5>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
