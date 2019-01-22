import React from 'react';
import CardContent from './CardContent';
import { renderWithTheme } from '../../../test/helpers';

describe('(Cards) CardContent', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<CardContent />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
