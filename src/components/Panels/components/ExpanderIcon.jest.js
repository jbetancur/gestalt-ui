import React from 'react';
import ExpanderIcon from './ExpanderIcon';
import { shallowWithTheme } from '../../../../test/helpers';

describe('(Panels) ExpanderIcon', () => {
  it('renders component without exploding', () => {
    const wrapper = shallowWithTheme(
      <ExpanderIcon />
    );

    expect(wrapper).to.have.length(1);
  });

  it('renders when expanded', () => {
    const wrapper = shallowWithTheme(
      <ExpanderIcon isExpanded />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders when collapsed', () => {
    const wrapper = shallowWithTheme(
      <ExpanderIcon isExpanded={false} />
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
