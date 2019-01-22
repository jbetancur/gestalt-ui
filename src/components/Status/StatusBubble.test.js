import React from 'react';
import StatusBubble from './StatusBubble';
import { renderWithTheme } from '../../../test/helpers';

describe('Components::StatusBubble::StatusBubble', () => {
  it('mounts with default props', () => {
    const { container } = renderWithTheme(<StatusBubble />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when a status is passed', () => {
    const { container } = renderWithTheme(<StatusBubble status="running" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
