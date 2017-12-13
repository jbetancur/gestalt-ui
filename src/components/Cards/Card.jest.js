import React from 'react';
import Card from './Card';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Cards) Card', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<Card />);

    expect(wrapper).to.have.length(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<Card />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
