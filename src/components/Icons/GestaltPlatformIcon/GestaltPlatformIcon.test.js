import React from 'react';
import { shallow } from 'enzyme';
import GestaltPlatformIcon from './index';

const wrapper = shallow(<GestaltPlatformIcon />);

describe('(Component) GestaltPlatformIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
