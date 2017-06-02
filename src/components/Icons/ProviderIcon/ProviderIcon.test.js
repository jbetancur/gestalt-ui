import React from 'react';
import { shallow } from 'enzyme';
import ProviderIcon from './index';

const wrapper = shallow(<ProviderIcon />);

describe('(Component) ProviderIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
