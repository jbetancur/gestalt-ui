import React from 'react';
import Caption from './Caption';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Component) Caption', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<Caption />);

    expect(wrapper).to.have.length(1);
  });

  it('renders with basic props', () => {
    const wrapper = shallowWithTheme(<Caption>this is a test</Caption>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it renders with light prop', () => {
    const wrapper = shallowWithTheme(<Caption light>this is a test</Caption>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it renders with small prop', () => {
    const wrapper = shallowWithTheme(<Caption small>this is a test</Caption>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it renders with large prop', () => {
    const wrapper = shallowWithTheme(<Caption large>this is a test</Caption>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('it renders with block prop', () => {
    const wrapper = shallowWithTheme(<Caption block>this is a test</Caption>);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
