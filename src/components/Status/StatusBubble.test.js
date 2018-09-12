import React from 'react';
import StatusBubble from './StatusBubble';
import { shallowWithTheme } from '../../../test/helpers';

describe('Components::StatusBubble::StatusBubble', () => {
  it('mounts with default props', () => {
    const wrapper = shallowWithTheme(<StatusBubble />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly when a status is passed', () => {
    const wrapper = shallowWithTheme(<StatusBubble status="running" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
