import React from 'react';
import { shallow } from 'enzyme';
import A from './A';

const wrapper = shallow(<A theme={{}} />);

describe('(Component) A', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
