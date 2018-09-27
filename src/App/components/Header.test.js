import React from 'react';
import Header from './Header';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Navigation) Header', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<Header />);

    expect(wrapper).toHaveLength(1);
  });

  it('renders a Header', () => {
    const wrapper = shallowWithTheme(<Header />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
