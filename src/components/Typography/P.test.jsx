import React from 'react';
import { shallow } from 'enzyme';
import P from './P';

const wrapper = shallow(<P />);

describe('(Component) P', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
