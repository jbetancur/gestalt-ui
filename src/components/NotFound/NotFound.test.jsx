import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './index';

const wrapper = shallow(<NotFound />);

describe('(Component) NotFound', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
