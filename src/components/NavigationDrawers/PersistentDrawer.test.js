import React from 'react';
import PersistentDrawer from './PersistentDrawer';
import { renderWithTheme } from '../../../test/helpers';

describe('NaviationDrawers::PersistentDrawer', () => {
  it('renders correctly with basic props and closed', () => {
    const { container } = renderWithTheme(
      <PersistentDrawer>hahaha</PersistentDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with basic props and open', () => {
    const { container } = renderWithTheme(
      <PersistentDrawer open>hahaha</PersistentDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with width', () => {
    const { container } = renderWithTheme(
      <PersistentDrawer open width="100%">hahaha</PersistentDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with miniWidth', () => {
    const { container } = renderWithTheme(
      <PersistentDrawer open miniWidth="120px">hahaha</PersistentDrawer>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
