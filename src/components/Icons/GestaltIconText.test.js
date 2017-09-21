import React from 'react';
import { shallow } from 'enzyme';
import GestaltIconText from './index';

const wrapper = shallow(<GestaltIconText />);

describe('(Component) GestaltIconText', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
