import React from 'react';
import Title from './Title';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) Title', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<Title />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<Title>this is a test</Title>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it render with small prop', () => {
    const wrapper = shallowWithTheme(<Title small>this is a test</Title>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it render with large prop', () => {
    const wrapper = shallowWithTheme(<Title large>this is a test</Title>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
