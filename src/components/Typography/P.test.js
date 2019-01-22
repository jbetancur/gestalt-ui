import React from 'react';
import P from './P';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) P', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<P>this is a test</P>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
