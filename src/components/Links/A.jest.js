import React from 'react';
import A from './A';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) A', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<A />);

    expect(wrapper).toHaveLength(1);
  });

  it('mounts without additional props', () => {
    const wrapper = shallowWithTheme(<A href="http://wassup" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mounts the bubble prop', () => {
    const wrapper = shallowWithTheme(<A href="http://wassup" bubble />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
