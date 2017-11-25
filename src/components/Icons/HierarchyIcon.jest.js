import React from 'react';
import { shallow } from 'enzyme';
import HierarchyIcon from './HierarchyIcon';

const wrapper = shallow(<HierarchyIcon />);

describe('(Component) HierarchyIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
