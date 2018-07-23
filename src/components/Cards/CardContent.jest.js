import React from 'react';
import CardContent from './CardContent';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Cards) CardContent', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<CardContent />);

    expect(wrapper).toHaveLength(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<CardContent />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
