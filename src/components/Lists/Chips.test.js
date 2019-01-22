import React from 'react';
import { render } from 'react-testing-library';
import Chips from './Chips';

describe('Chips', () => {
  it('mounts with basic props', () => {
    const { container } = render(<Chips id="test" meta={{ error: null, touched: false }} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
