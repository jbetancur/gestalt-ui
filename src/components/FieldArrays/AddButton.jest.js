import React from 'react';
import AddButton from './AddButton';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Components) AddButton', () => {
  it('renders correctly with basic required props', () => {
    const wrapper = shallowWithTheme(<AddButton onClick={jest.fn()} />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const wrapper = shallowWithTheme(<AddButton onClick={jest.fn()} label="Wow" />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });
});
