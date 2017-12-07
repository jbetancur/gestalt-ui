import React from 'react';
import NavHeader from './NavHeader';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Navigation) NavHeader', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<NavHeader />);

    expect(wrapper).to.have.length(1);
  });

  it('renders a NavHeader', () => {
    const wrapper = shallowWithTheme(<NavHeader />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
