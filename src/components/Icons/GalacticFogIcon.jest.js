import React from 'react';
import { render } from 'react-testing-library';
import GalacticFogIcon from './GalacticFogIcon';

describe('(Component) GalacticFogIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<GalacticFogIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
