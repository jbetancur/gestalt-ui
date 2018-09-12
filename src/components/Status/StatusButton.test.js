import React from 'react';
import StatusButton from './StatusButton';
import { shallowWithTheme } from '../../../test/helpers';

describe('Components::StatusButton::StatusButton', () => {
  it('mounts with default props', () => {
    const wrapper = shallowWithTheme(<StatusButton />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly when a status is passed', () => {
    const wrapper = shallowWithTheme(<StatusButton status="running" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly when the button has inMenu passed', () => {
    const wrapper = shallowWithTheme(<StatusButton status="running" inMenu />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
