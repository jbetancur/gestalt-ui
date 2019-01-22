import React from 'react';
import Subtitle from './Subtitle';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) Subtitle', () => {
  it('renders with basic props', () => {
    const { container } = renderWithTheme(<Subtitle>this is a test</Subtitle>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
