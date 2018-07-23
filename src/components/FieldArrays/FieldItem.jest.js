import React from 'react';
import FieldItem from './FieldItem';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Components) FieldItem', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<FieldItem />);

    expect(wrapper).toHaveLength(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<FieldItem />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
