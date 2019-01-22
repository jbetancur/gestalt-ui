import React from 'react';
import FieldItem from './FieldItem';
import { renderWithTheme } from '../../../test/helpers';

describe('(Components) FieldItem', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<FieldItem />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
