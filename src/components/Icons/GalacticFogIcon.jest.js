import React from 'react';
import { shallow } from 'enzyme';
import GalacticFogIcon from './GalacticFogIcon';

const wrapper = shallow(<GalacticFogIcon />);

describe('(Component) GalacticFogIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).toHaveLength(1);
  });
});
