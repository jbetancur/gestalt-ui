import React from 'react';
import H1 from './H1';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) H1', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<H1 />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<H1>this is a test</H1>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
