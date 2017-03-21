import React from 'react';
import { shallow } from 'enzyme';
import GalacticFogIcon from './index';

const wrapper = shallow(<GalacticFogIcon />);

describe('(Component) GalacticFogIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
