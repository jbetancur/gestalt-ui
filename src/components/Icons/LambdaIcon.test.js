import React from 'react';
import { shallow } from 'enzyme';
import LambdaIcon from './LambdaIcon';

const wrapper = shallow(<LambdaIcon />);

describe('(Component) LambdaIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
