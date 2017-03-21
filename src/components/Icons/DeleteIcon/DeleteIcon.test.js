import React from 'react';
import { shallow } from 'enzyme';
import DeleteIcon from './index';

const wrapper = shallow(<DeleteIcon />);

describe('(Component) DeleteIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
