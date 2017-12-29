import React from 'react';
import FieldItem from './FieldItem';
import { shallowWithTheme } from '../../../test/helpers';

describe('(ResourceTypes) FieldItem', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<FieldItem />);

    expect(wrapper).to.have.length(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<FieldItem />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
