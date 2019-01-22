import React from 'react';
import AddButton from './AddButton';
import { renderWithTheme } from '../../../test/helpers';

describe('(Components) AddButton', () => {
  it('renders correctly with basic required props', () => {
    const { container } = renderWithTheme(<AddButton onClick={jest.fn()} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const { container } = renderWithTheme(<AddButton onClick={jest.fn()} label="Wow" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
