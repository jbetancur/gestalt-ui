import React from 'react';
import CardText from './CardText';
import { renderWithTheme } from '../../../test/helpers';

describe('(Cards) CardText', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<CardText />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
