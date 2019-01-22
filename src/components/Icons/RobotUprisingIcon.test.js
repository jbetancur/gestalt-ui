import React from 'react';
import { render } from 'react-testing-library';
import RobotUprisingIcon from './RobotUprisingIcon';


describe('(Component) RobotUprisingIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<RobotUprisingIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
