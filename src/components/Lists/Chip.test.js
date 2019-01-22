import React from 'react';
import { fireEvent } from 'react-testing-library';
import Chip from './Chip';
import { renderWithTheme } from '../../../test/helpers';

describe('(Chips) Chip', () => {
  it('mounts with basic props', () => {
    const mockRemove = jest.fn();
    const { container } = renderWithTheme(<Chip item="test" onRemove={mockRemove} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles onClick of Remove button ', () => {
    const mockRemove = jest.fn();
    const { container } = renderWithTheme(<Chip item="test" onRemove={mockRemove} />);

    fireEvent.click(container.querySelector('button'));

    expect(mockRemove).toBeCalledWith('test');
  });
});
