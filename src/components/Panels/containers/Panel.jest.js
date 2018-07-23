import React from 'react';
import Panel from './Panel';
import { shallowWithTheme, mountWithTheme } from '../../../../test/helpers';

describe('(Panels) Panel', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb" />
    );

    expect(wrapper).toHaveLength(1);
  });

  it('renders component with basic props', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb" />
    );

    // need to dive 2 levels (themeprovider and component) down to get to our wrapper div style
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders component with minHeight prop', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb" minHeight="10em" />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders component with noPadding prop', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb" noPadding />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders component with children', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb"><span>this is a test</span></Panel>
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders component activity status when pending', () => {
    const wrapper = shallowWithTheme(
      <Panel title="gazobazorb" pending><span>this is a test</span></Panel>
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('toggles isExpanded on correct elements when the Header is clicked', () => {
    const wrapper = mountWithTheme(
      <Panel title="gazobazorb"><span>this is a test</span></Panel>
    );
    const header = wrapper.find('WithTheme(Header)');
    const expanderIcon = () => wrapper.find('WithTheme(ExpanderIcon)').props();
    const content = () => wrapper.find('WithTheme(Content)').props();

    header.simulate('click');

    expect(expanderIcon().isExpanded).toBe(false);
    expect(content().isExpanded).toBe(false);
  });
});
