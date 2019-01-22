import React from 'react';
import { render } from 'react-testing-library';
import ChipsAuto from './ChipsAuto';

describe('ChipsAuto', () => {
  it('mounts with basic props', () => {
    const { container } = render(<ChipsAuto meta={{ error: null, touched: false }} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
