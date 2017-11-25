import React from 'react';
import Subtitle from './Subtitle';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) Subtitle', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<Subtitle />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<Subtitle>this is a test</Subtitle>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
