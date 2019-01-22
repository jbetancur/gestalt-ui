import React from 'react';
import { render } from 'react-testing-library';
import LambdaIcon from './LambdaIcon';


describe('(Component) LambdaIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<LambdaIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
