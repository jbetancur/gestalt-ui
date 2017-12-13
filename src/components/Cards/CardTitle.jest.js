import React from 'react';
import CardTitle from './Card';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Cards) CardTitle', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<CardTitle />);

    expect(wrapper).to.have.length(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<CardTitle />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mounts with children', () => {
    const wrapper = shallowWithTheme(<CardTitle>Hellow!</CardTitle>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
