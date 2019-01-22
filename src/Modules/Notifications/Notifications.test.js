import React from 'react';
import { renderWithTheme } from '../../../test/helpers';
import { Notifications } from './Notifications';

describe('(Notifications) Notifications', () => {
  it('renders to correct snapshot with no items in the queue', () => {
    const { container } = renderWithTheme(
      <Notifications queue={[]} removeNotification={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot with items in the queue', () => {
    const { container } = renderWithTheme(
      <Notifications queue={[{ id: 1, message: 'hi ho' }]} removeNotification={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
