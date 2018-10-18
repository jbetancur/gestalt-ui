import React from 'react';
import H5 from './H5';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) H5', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<H5 />);

    expect(wrapper).toHaveLength(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<H5>this is a test</H5>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
