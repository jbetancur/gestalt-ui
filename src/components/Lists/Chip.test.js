import React from 'react';
import Chip from './Chip';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Chips) Chip', () => {
  it('mounts with basic props', () => {
    const mockRemove = jest.fn();
    const wrapper = shallowWithTheme(<Chip item="test" onRemove={mockRemove} />);

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('handles onClick of Remove button ', () => {
    const mockRemove = jest.fn();
    const wrapper = shallowWithTheme(<Chip item="test" onRemove={mockRemove} />);

    const RemoveButton = wrapper.dive().find('Chip__Remove');
    RemoveButton.simulate('click');

    expect(mockRemove).toBeCalledWith('test');
  });
});
