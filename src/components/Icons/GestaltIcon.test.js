import React from 'react';
import { shallow } from 'enzyme';
import GestaltIcon from './GestaltIcon';

const wrapper = shallow(<GestaltIcon />);

describe('(Component) GestaltIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
