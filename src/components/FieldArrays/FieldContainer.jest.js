import React from 'react';
import FieldContainer from './FieldContainer';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Components) FieldContainer', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<FieldContainer />);

    expect(wrapper).to.have.length(1);
  });

  it('mounts with basic props', () => {
    const wrapper = shallowWithTheme(<FieldContainer />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
