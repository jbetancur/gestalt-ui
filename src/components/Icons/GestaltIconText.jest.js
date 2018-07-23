import React from 'react';
import { shallow } from 'enzyme';
import GestaltIconText from './GestaltIconText';

const wrapper = shallow(<GestaltIconText />);

describe('(Component) GestaltIconText', () => {
  it('renders component without exploding', () => {
    expect(wrapper).toHaveLength(1);
  });
});
