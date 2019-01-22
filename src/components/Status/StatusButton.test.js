import React from 'react';
import StatusButton from './StatusButton';
import { renderWithTheme } from '../../../test/helpers';

describe('Components::StatusButton::StatusButton', () => {
  it('mounts with default props', () => {
    const { container } = renderWithTheme(<StatusButton />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when a status is passed', () => {
    const { container } = renderWithTheme(<StatusButton status="running" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when the button has inMenu passed', () => {
    const { container } = renderWithTheme(<StatusButton status="running" inMenu />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
