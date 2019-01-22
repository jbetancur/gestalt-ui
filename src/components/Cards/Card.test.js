import React from 'react';
import Card from './Card';
import { renderWithTheme } from '../../../test/helpers';

describe('(Cards) Card', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<Card />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
