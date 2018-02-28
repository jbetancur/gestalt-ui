import React from 'react';
import RemoveButton from './RemoveButton';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Components) RemoveButton', () => {
  it('mounts with basic mountWithTheme', () => {
    const wrapper = shallowWithTheme(<RemoveButton onRemove={sinon.spy()} fieldIndex={1} />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });
});
