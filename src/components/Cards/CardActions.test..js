import React from 'react';
import CardActions from './CardActions';
import { renderWithTheme } from '../../../test/helpers';

describe('(Cards) CardActions', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<CardActions />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
