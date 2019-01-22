import React from 'react';
import { render } from 'react-testing-library';
import GestaltIcon from './GestaltIcon';

describe('(Component) GestaltIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<GestaltIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
