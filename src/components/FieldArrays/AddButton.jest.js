import React from 'react';
import AddButton from './AddButton';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Components) AddButton', () => {
  it('renders correctly with basic required props', () => {
    const wrapper = shallowWithTheme(<AddButton onAddItem={sinon.spy()} />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const wrapper = shallowWithTheme(<AddButton onAddItem={sinon.spy()} label="Wow" />);

    expect(wrapper.dive().dive().dive()).toMatchSnapshot();
  });
});
