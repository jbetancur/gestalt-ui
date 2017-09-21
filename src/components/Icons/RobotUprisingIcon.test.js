import React from 'react';
import { shallow } from 'enzyme';
import RobotUprisingIcon from './RobotUprisingIcon';

const wrapper = shallow(<RobotUprisingIcon />);

describe('(Component) RobotUprisingIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
