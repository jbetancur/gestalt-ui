import React from 'react';
import ExpanderIcon from './ExpanderIcon';
import { renderWithTheme } from '../../../../test/helpers';

describe('(Panels) ExpanderIcon', () => {
  it('renders component without exploding', () => {
    const { container } = renderWithTheme(
      <ExpanderIcon />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders when expanded', () => {
    const { container } = renderWithTheme(
      <ExpanderIcon isExpanded />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders when collapsed', () => {
    const { container } = renderWithTheme(
      <ExpanderIcon isExpanded={false} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
