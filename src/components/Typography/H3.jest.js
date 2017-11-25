import React from 'react';
import H3 from './H3';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) H3', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<H3 />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<H3>this is a test</H3>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
