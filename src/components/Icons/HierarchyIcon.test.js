import React from 'react';
import { render } from 'react-testing-library';
import HierarchyIcon from './HierarchyIcon';


describe('(Component) HierarchyIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<HierarchyIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
