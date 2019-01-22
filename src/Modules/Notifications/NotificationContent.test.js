import React from 'react';
import { fireEvent } from 'react-testing-library';
import NotificationContent from './NotificationContent';
import { renderWithTheme } from '../../../test/helpers';

describe('(Notifications) NotificationContent', () => {
  it('renders to correct snapshot with default message payload', () => {
    const mockMessage = { id: 1, message: 'morty' };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot when message has icon prop set to true', () => {
    const mockMessage = { id: 1, message: 'morty', icon: true };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is info', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'info' };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is warning', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'warning' };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is error', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'error' };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is success', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'success' };
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles onRemove when called', () => {
    const mockMessage = { id: 1, message: 'morty' };
    const onRemoveMock = jest.fn();
    const { container } = renderWithTheme(
      <NotificationContent message={mockMessage} onRemove={onRemoveMock} />
    );

    const button = container.querySelector('#close-1');
    fireEvent.click(button);

    expect(onRemoveMock).toBeCalledWith(mockMessage);
  });
});
