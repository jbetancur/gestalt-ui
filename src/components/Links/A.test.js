import React from 'react';
import A from './A';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) A', () => {
  it('mounts without additional props', () => {
    const { container } = renderWithTheme(<A href="http://wassup" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('mounts the bubble prop', () => {
    const { container } = renderWithTheme(<A href="http://wassup" bubble />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
