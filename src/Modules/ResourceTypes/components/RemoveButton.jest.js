import React from 'react';
import RemoveButton from './RemoveButton';
import { shallowWithTheme } from '../../../../test/helpers';

describe('(ResourceTypes) RemoveButton', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(<RemoveButton />);

    expect(wrapper).to.have.length(1);
  });

  it('mounts with basic mountWithTheme', () => {
    const wrapper = shallowWithTheme(<RemoveButton onClick={() => { }} />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });
});
