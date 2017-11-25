import React from 'react';
import H4 from './H4';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) H4', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<H4 />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<H4>this is a test</H4>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
