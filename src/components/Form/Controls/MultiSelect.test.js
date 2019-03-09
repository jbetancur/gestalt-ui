import React from 'react';
import { render } from 'react-testing-library';
import MultiSelect from './MultiSelect';

describe('MultiSelect', () => {
  it('mounts with basic props', () => {
    const { container } = render(<MultiSelect meta={{ error: null, touched: false }} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
