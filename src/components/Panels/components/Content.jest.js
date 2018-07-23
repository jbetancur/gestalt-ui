import React from 'react';
import Content from './Content';
import { shallowWithTheme } from '../../../../test/helpers';

describe('(Panels) Content', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(
      <Content />
    );

    expect(wrapper).toHaveLength(1);
  });

  it('renders that is expanded', () => {
    const wrapper = shallowWithTheme(
      <Content isExpanded />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders that is collapsed', () => {
    const wrapper = shallowWithTheme(
      <Content isExpanded={false} />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders with minHeight', () => {
    const wrapper = shallowWithTheme(
      <Content minHeight="1em" />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders with noPadding', () => {
    const wrapper = shallowWithTheme(
      <Content noPadding />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
