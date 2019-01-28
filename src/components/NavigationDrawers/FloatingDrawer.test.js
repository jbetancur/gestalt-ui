import React from 'react';
import FloatingDrawer from './FloatingDrawer';
import { renderWithTheme } from '../../../test/helpers';

describe('NaviationDrawers::FloatingDrawer', () => {
  it('renders correctly with basic props and closed', () => {
    const { container } = renderWithTheme(
      <FloatingDrawer title="Don't Mock me!">hahaha</FloatingDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with basic props when open', () => {
    const { container } = renderWithTheme(
      <FloatingDrawer title="Don't Mock me!" open>hahaha</FloatingDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when direction is right and closed', () => {
    const { container } = renderWithTheme(
      <FloatingDrawer title="Don't Mock me!" direction="right">hahaha</FloatingDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when direction is right and open', () => {
    const { container } = renderWithTheme(
      <FloatingDrawer title="Don't Mock me!" direction="right" open>hahaha</FloatingDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly when a custom width is set', () => {
    const { container } = renderWithTheme(
      <FloatingDrawer title="Don't Mock me!" open width="100%">hahaha</FloatingDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
