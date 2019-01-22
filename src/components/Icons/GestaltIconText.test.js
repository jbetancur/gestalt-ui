import React from 'react';
import { render } from 'react-testing-library';
import GestaltIconText from './GestaltIconText';


describe('(Component) GestaltIconText', () => {
  it('renders component without exploding', () => {
    const { container } = render(<GestaltIconText />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
