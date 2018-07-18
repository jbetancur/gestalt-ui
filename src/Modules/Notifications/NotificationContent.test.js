import React from 'react';
import NotificationContent from './NotificationContent';
import { shallowWithTheme } from '../../../test/helpers';

describe('(Notifications) NotificationContent', () => {
  it('renders to correct snapshot with default message payload', () => {
    const mockMessage = { id: 1, message: 'morty' };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders to correct snapshot when message has icon prop set to true', () => {
    const mockMessage = { id: 1, message: 'morty', icon: true };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is info', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'info' };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is warning', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'warning' };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is error', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'error' };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('renders to correct snapshot when message status is success', () => {
    const mockMessage = { id: 1, message: 'morty', status: 'success' };
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={jest.fn()} />
    );

    expect(wrapper.dive().dive()).toMatchSnapshot();
  });

  it('handles onRemove when called', () => {
    const mockMessage = { id: 1, message: 'morty' };
    const onRemoveMock = jest.fn();
    const wrapper = shallowWithTheme(
      <NotificationContent message={mockMessage} onRemove={onRemoveMock} />
    );

    const button = wrapper.dive().find('#close-1');
    button.simulate('click');

    expect(onRemoveMock).toBeCalledWith(mockMessage);
  });
});
