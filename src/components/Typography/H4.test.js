import React from 'react';
import H4 from './H4';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) H4', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<H4>this is a test</H4>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
