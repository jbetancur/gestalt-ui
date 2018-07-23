import React from 'react';
import H2 from './H2';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) H2', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<H2 />);

    expect(wrapper).toHaveLength(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<H2>this is a test</H2>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
