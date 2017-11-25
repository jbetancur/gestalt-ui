import React from 'react';
import A from './A';
import baseTheme from '../themes/light';
import { shallowWithTheme } from '../../test/helpers';

describe('(Component) A', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<A />);

    expect(wrapper).to.have.length(1);
  });

  test('it mounts without additional props', () => {
    const wrapper = shallowWithTheme(<A href="http://wassup" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  test('it mounts the bubble prop', () => {
    const wrapper = shallowWithTheme(<A href="http://wassup" bubble />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
