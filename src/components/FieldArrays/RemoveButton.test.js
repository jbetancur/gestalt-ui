import React from 'react';
import RemoveButton from './RemoveButton';
import { renderWithTheme } from '../../../test/helpers';

describe('(Components) RemoveButton', () => {
  it('mounts with basic renderWithTheme', () => {
    const { container } = renderWithTheme(<RemoveButton onRemove={jest.fn()} fieldIndex={1} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
