import React from 'react';
import { mount } from 'enzyme';
import DeleteIcon from './DeleteIcon';

const wrapper = mount(<DeleteIcon />);

describe('(Component) DeleteIcon', () => {
  it('mounts component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
