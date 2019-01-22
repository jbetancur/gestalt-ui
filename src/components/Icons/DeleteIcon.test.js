import React from 'react';
import DeleteIcon from './DeleteIcon';
import { renderWithTheme } from '../../../test/helpers';

describe('(Component) DeleteIcon', () => {
  it('renders component without exploding', () => {
    const { container } = renderWithTheme(<DeleteIcon />);

    expect(container.firstChild).toMatchSnapshot(1);
  });

  test('it mounts without additional props', () => {
    const { container } = renderWithTheme(<DeleteIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
