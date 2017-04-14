import React from 'react';
import { shallow } from 'enzyme';
import A from './index';

const wrapper = shallow(<A />);

describe('(Component) A', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
