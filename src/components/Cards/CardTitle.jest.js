import React from 'react';
import CardTitle from './CardTitle';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Cards) CardTitle', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<CardTitle />);

    expect(wrapper).toHaveLength(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<CardTitle />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mounts with children', () => {
    const wrapper = shallowWithTheme(<CardTitle>Hellow!</CardTitle>);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('mounts with title and subTitle', () => {
    const wrapper = shallowWithTheme(<CardTitle title="woop" subTitle="woop!" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
