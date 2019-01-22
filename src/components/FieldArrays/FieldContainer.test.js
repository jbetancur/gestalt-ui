import React from 'react';
import FieldContainer from './FieldContainer';
import { renderWithTheme } from '../../../test/helpers';

describe('(Components) FieldContainer', () => {
  it('mounts with basic props', () => {
    const { container } = renderWithTheme(<FieldContainer />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
