import React from 'react';
import P from './P';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) P', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<P />);

    expect(wrapper).toHaveLength(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<P>this is a test</P>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
